// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY as any,
});

const thirdwebFacilitator = facilitator({
  client,
  serverWalletAddress: "0x1234567890123456789012345678901234567890",
});

export async function middleware(request: NextRequest) {
  const method = request.method.toUpperCase();
  const resourceUrl = request.nextUrl.toString();
  const paymentData = request.headers.get("x-payment");

  const result = await settlePayment({
    resourceUrl,
    method,
    paymentData,
    payTo: "0x1234567890123456789012345678901234567890",
    network: arbitrumSepolia,
    price: "$0.01",
    routeConfig: {
      description: "Access to paid content",
      mimeType: "application/json",
      maxTimeoutSeconds: 300,
    },
    facilitator: thirdwebFacilitator,
  });

  if (result.status === 200) {
    // Payment successful, continue to the route
    const response = NextResponse.next();
    // Set payment receipt headers
    for (const [key, value] of Object.entries(
      result.responseHeaders,
    )) {
      response.headers.set(key, value);
    }
    return response;
  }

  // Payment required
  return NextResponse.json(result.responseBody, {
    status: result.status,
    headers: result.responseHeaders,
  });
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/streams/:path*"],
};
