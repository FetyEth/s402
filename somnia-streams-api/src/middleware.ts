import { paymentMiddleware } from "x402-next";

export const middleware = paymentMiddleware(
  "0x1d72b383cd2f783e4f2edafe9d7544a3355507c2", // Your receiving wallet
  {
    "/streams": {
      price: "$0.01",
      network: "somnia",
      config: {
        description: "Access to Somnia Streams API",
      },
    },
  },
  {
    url: "http://localhost:3002", // Facilitator URL for Base Sepolia testnet
  }
);

export const config = {
  matcher: ["/streams/:path*"], // 👈 protect only /streams routes
};
