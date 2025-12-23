import { loadStripe, Stripe } from "@stripe/stripe-js";

// Stripe publishable key from environment variables
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Singleton promise for Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe instance (singleton pattern)
 * Load Stripe.js outside of component render to avoid recreating on every render
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.error(
        "Stripe publishable key is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY."
      );
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Stripe Elements appearance configuration
 * Customize to match your brand
 */
export const stripeElementsAppearance = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#7bc74d",
    colorBackground: "#ffffff",
    colorText: "#1f2937",
    colorDanger: "#ef4444",
    fontFamily: "system-ui, -apple-system, sans-serif",
    spacingUnit: "4px",
    borderRadius: "12px",
    fontSizeBase: "16px",
  },
  rules: {
    ".Input": {
      border: "2px solid #e5e7eb",
      boxShadow: "none",
      padding: "12px 16px",
    },
    ".Input:focus": {
      border: "2px solid #7bc74d",
      boxShadow: "0 0 0 3px rgba(123, 199, 77, 0.1)",
    },
    ".Input--invalid": {
      border: "2px solid #ef4444",
    },
    ".Label": {
      fontWeight: "500",
      color: "#374151",
      marginBottom: "8px",
    },
    ".Error": {
      color: "#ef4444",
      fontSize: "14px",
      marginTop: "4px",
    },
  },
};

/**
 * Default currency for payments
 */
export const DEFAULT_CURRENCY = "MYR";

/**
 * Frontend return URL after payment
 * @param businessName - The business name for the URL
 * @param paymentType - Type of payment (e.g., "topup" for wallet topup)
 */
export const getReturnUrl = (businessName: string, paymentType?: string): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const typeParam = paymentType ? `&type=${paymentType}` : "";
  return `${baseUrl}/${encodeURIComponent(businessName)}/billing?payment=complete${typeParam}`;
};


