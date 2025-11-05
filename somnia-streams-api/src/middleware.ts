import { paymentMiddleware, Network } from 'x402-next';

// Configure the payment middleware
export const middleware = paymentMiddleware(
  "0x541cc10d295671697ff7e8c841af097ed0ea3802",
  {
    '/streams': {
      price: '$0.01',
      network: "base-sepolia",
      config: {
        description: 'Access to Somnia Streams API',
      }
    },
  },
  {
    url: "https://x402.org/facilitator", // Facilitator URL for Base Sepolia testnet.
  }
);

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/streams/:path*',
  ]
};