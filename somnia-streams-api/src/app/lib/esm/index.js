// src/index.ts
import { NextResponse as NextResponse2 } from "next/server";
import { getAddress } from "viem";
import { exact } from "x402/schemes";
import {
  computeRoutePatterns,
  findMatchingPaymentRequirements,
  findMatchingRoute,
  processPriceToAtomicAmount,
  toJsonSafe
} from "x402/shared";
import { getPaywallHtml } from "x402/paywall";
import {
  moneySchema,
  SupportedEVMNetworks,
  SupportedSVMNetworks
} from "x402/types";
import { useFacilitator } from "x402/verify";
import { safeBase64Encode } from "x402/shared";

// src/api/session-token.ts
import { generateJwt } from "@coinbase/cdp-sdk/auth";
import { NextResponse } from "next/server";
async function POST(request) {
  try {
    const apiKeyId = process.env.CDP_API_KEY_ID;
    const apiKeySecret = process.env.CDP_API_KEY_SECRET;
    if (!apiKeyId || !apiKeySecret) {
      console.error("Missing CDP API credentials");
      return NextResponse.json(
        { error: "Server configuration error: Missing CDP API credentials" },
        { status: 500 }
      );
    }
    const body = await request.json();
    const { addresses, assets } = body;
    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return NextResponse.json(
        { error: "addresses is required and must be a non-empty array" },
        { status: 400 }
      );
    }
    const jwt = await generateJwt({
      apiKeyId,
      apiKeySecret,
      requestMethod: "POST",
      requestHost: "api.developer.coinbase.com",
      requestPath: "/onramp/v1/token"
    });
    const tokenRequestPayload = {
      addresses: addresses.map((addr) => ({
        address: addr.address,
        blockchains: addr.blockchains || ["base"]
      })),
      ...assets && { assets }
    };
    const response = await fetch("https://api.developer.coinbase.com/onramp/v1/token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tokenRequestPayload)
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to generate session token:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to generate session token" },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating session token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// src/index.ts
function paymentMiddleware(payTo, routes, facilitator, paywall) {
  const { verify, settle, supported } = useFacilitator(facilitator);
  const x402Version = 1;
  const routePatterns = computeRoutePatterns(routes);
  return async function middleware(request) {
    var _a;
    const pathname = request.nextUrl.pathname;
    const method = request.method.toUpperCase();
    const matchingRoute = findMatchingRoute(routePatterns, pathname, method);
    if (!matchingRoute) {
      return NextResponse2.next();
    }
    const { price, network, config = {} } = matchingRoute.config;
    const {
      description,
      mimeType,
      maxTimeoutSeconds,
      inputSchema,
      outputSchema,
      customPaywallHtml,
      resource,
      errorMessages,
      discoverable
    } = config;
    const atomicAmountForAsset = processPriceToAtomicAmount(price, network);
    if ("error" in atomicAmountForAsset) {
      return new NextResponse2(atomicAmountForAsset.error, { status: 500 });
    }
    const { maxAmountRequired, asset } = atomicAmountForAsset;
    const resourceUrl = resource || `${request.nextUrl.protocol}//${request.nextUrl.host}${pathname}`;
    let paymentRequirements = [];
    if (SupportedEVMNetworks.includes(network)) {
      paymentRequirements.push({
        scheme: "exact",
        network,
        maxAmountRequired,
        resource: resourceUrl,
        description: description ?? "",
        mimeType: mimeType ?? "application/json",
        payTo: getAddress(payTo),
        maxTimeoutSeconds: maxTimeoutSeconds ?? 300,
        asset: getAddress(asset.address),
        // TODO: Rename outputSchema to requestStructure
        outputSchema: {
          input: {
            type: "http",
            method,
            discoverable: discoverable ?? true,
            ...inputSchema
          },
          output: outputSchema
        },
        extra: asset.eip712
      });
    } else if (SupportedSVMNetworks.includes(network)) {
      const paymentKinds = await supported();
      let feePayer;
      for (const kind of paymentKinds.kinds) {
        if (kind.network === network && kind.scheme === "exact") {
          feePayer = (_a = kind == null ? void 0 : kind.extra) == null ? void 0 : _a.feePayer;
          break;
        }
      }
      if (!feePayer) {
        throw new Error(`The facilitator did not provide a fee payer for network: ${network}.`);
      }
      paymentRequirements.push({
        scheme: "exact",
        network,
        maxAmountRequired,
        resource: resourceUrl,
        description: description ?? "",
        mimeType: mimeType ?? "",
        payTo,
        maxTimeoutSeconds: maxTimeoutSeconds ?? 60,
        asset: asset.address,
        // TODO: Rename outputSchema to requestStructure
        outputSchema: {
          input: {
            type: "http",
            method,
            discoverable: discoverable ?? true,
            ...inputSchema
          },
          output: outputSchema
        },
        extra: {
          feePayer
        }
      });
    } else {
      throw new Error(`Unsupported network: ${network}`);
    }
    const paymentHeader = request.headers.get("X-PAYMENT");
    if (!paymentHeader) {
      const accept = request.headers.get("Accept");
      if (accept == null ? void 0 : accept.includes("text/html")) {
        const userAgent = request.headers.get("User-Agent");
        if (userAgent == null ? void 0 : userAgent.includes("Mozilla")) {
          let displayAmount;
          if (typeof price === "string" || typeof price === "number") {
            const parsed = moneySchema.safeParse(price);
            if (parsed.success) {
              displayAmount = parsed.data;
            } else {
              displayAmount = Number.NaN;
            }
          } else {
            displayAmount = Number(price.amount) / 10 ** price.asset.decimals;
          }
          const html = customPaywallHtml ?? getPaywallHtml({
            amount: displayAmount,
            paymentRequirements: toJsonSafe(paymentRequirements),
            currentUrl: request.url,
            testnet: network === "somnia-testnet",
            cdpClientKey: paywall == null ? void 0 : paywall.cdpClientKey,
            appLogo: paywall == null ? void 0 : paywall.appLogo,
            appName: paywall == null ? void 0 : paywall.appName,
            sessionTokenEndpoint: paywall == null ? void 0 : paywall.sessionTokenEndpoint
          });
          return new NextResponse2(html, {
            status: 402,
            headers: { "Content-Type": "text/html" }
          });
        }
      }
      return new NextResponse2(
        JSON.stringify({
          x402Version,
          error: (errorMessages == null ? void 0 : errorMessages.paymentRequired) || "X-PAYMENT header is required",
          accepts: paymentRequirements
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }
    let decodedPayment;
    try {
      decodedPayment = exact.evm.decodePayment(paymentHeader);
      decodedPayment.x402Version = x402Version;
    } catch (error) {
      return new NextResponse2(
        JSON.stringify({
          x402Version,
          error: (errorMessages == null ? void 0 : errorMessages.invalidPayment) || (error instanceof Error ? error : "Invalid payment"),
          accepts: paymentRequirements
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }
    const selectedPaymentRequirements = findMatchingPaymentRequirements(
      paymentRequirements,
      decodedPayment
    );
    if (!selectedPaymentRequirements) {
      return new NextResponse2(
        JSON.stringify({
          x402Version,
          error: (errorMessages == null ? void 0 : errorMessages.noMatchingRequirements) || "Unable to find matching payment requirements",
          accepts: toJsonSafe(paymentRequirements)
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }
    const verification = await verify(decodedPayment, selectedPaymentRequirements);
    if (!verification.isValid) {
      return new NextResponse2(
        JSON.stringify({
          x402Version,
          error: (errorMessages == null ? void 0 : errorMessages.verificationFailed) || verification.invalidReason,
          accepts: paymentRequirements,
          payer: verification.payer
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }
    const response = await NextResponse2.next();
    if (response.status >= 400) {
      return response;
    }
    try {
      const settlement = await settle(decodedPayment, selectedPaymentRequirements);
      if (settlement.success) {
        response.headers.set(
          "X-PAYMENT-RESPONSE",
          safeBase64Encode(
            JSON.stringify({
              success: true,
              transaction: settlement.transaction,
              network: settlement.network,
              payer: settlement.payer
            })
          )
        );
      }
    } catch (error) {
      return new NextResponse2(
        JSON.stringify({
          x402Version,
          error: (errorMessages == null ? void 0 : errorMessages.settlementFailed) || (error instanceof Error ? error : "Settlement failed"),
          accepts: paymentRequirements
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }
    return response;
  };
}
export {
  POST,
  paymentMiddleware
};
//# sourceMappingURL=index.js.map