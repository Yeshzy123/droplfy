import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    storage: 1 * 1024 * 1024 * 1024, // 1GB
    bandwidth: 5 * 1024 * 1024 * 1024, // 5GB
    maxFileSize: 5 * 1024 * 1024, // 5MB
    features: ["1GB Storage", "5GB Bandwidth", "Basic Support", "Ads Enabled"],
    stripePriceId: null,
  },
  pro: {
    name: "Pro",
    price: 9,
    storage: 100 * 1024 * 1024 * 1024, // 100GB
    bandwidth: 500 * 1024 * 1024 * 1024, // 500GB
    maxFileSize: 50 * 1024 * 1024, // 50MB
    features: [
      "100GB Storage",
      "500GB Bandwidth",
      "No Ads",
      "Priority Processing",
      "WebP Conversion",
      "API Access",
      "Priority Support",
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_placeholder",
  },
  business: {
    name: "Business",
    price: 29,
    storage: 1024 * 1024 * 1024 * 1024, // 1TB
    bandwidth: 5 * 1024 * 1024 * 1024 * 1024, // 5TB
    maxFileSize: 200 * 1024 * 1024, // 200MB
    features: [
      "1TB Storage",
      "5TB Bandwidth",
      "No Ads",
      "Custom Domain",
      "Team Accounts",
      "Full API Access",
      "Dedicated Support",
      "Malware Scanning",
      "Custom Branding",
    ],
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID || "price_business_placeholder",
  },
  lifetime: {
    name: "Lifetime",
    price: 100,
    storage: 2 * 1024 * 1024 * 1024 * 1024, // 2TB
    bandwidth: 10 * 1024 * 1024 * 1024 * 1024, // 10TB
    maxFileSize: 500 * 1024 * 1024, // 500MB
    features: [
      "2TB Storage",
      "10TB Bandwidth",
      "No Ads Forever",
      "Custom Domain",
      "Unlimited Team Accounts",
      "Full API Access",
      "Priority Support",
      "Malware Scanning",
      "Custom Branding",
      "Lifetime Updates",
      "Early Access Features",
    ],
    stripePriceId: process.env.STRIPE_LIFETIME_PRICE_ID || "price_lifetime_placeholder",
  },
} as const;

export type PlanName = keyof typeof PLANS;
