import { api } from "./client";
import type {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  BillingPortalResponse,
  InvoicesResponse,
} from "../types/payment";

export const paymentApi = {
  /**
   * Create a checkout session for payment
   * @param data - Checkout session request data
   * @returns Checkout session with client_secret for Stripe Elements
   */
  createCheckoutSession: async (
    data: CheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> => {
    return api.post<CheckoutSessionResponse>("/payment/checkout", data);
  },

  /**
   * Create a billing portal session for the business
   * @param businessId - The business ID
   * @returns Billing portal session with URL to redirect
   */
  createBillingPortalSession: async (
    businessId: string
  ): Promise<BillingPortalResponse> => {
    return api.get<BillingPortalResponse>(
      `/payment/billing-portal/business/${businessId}`
    );
  },

  /**
   * Get invoices for a business
   * @param businessId - The business ID
   * @returns List of invoices from Stripe
   */
  getInvoices: async (businessId: string): Promise<InvoicesResponse> => {
    return api.get<InvoicesResponse>(`/payment/invoices/business/${businessId}`);
  },
};

