// Payment API Types

export interface CheckoutSessionRequest {
  business_id: string;
  currency: string;
  amount: number;
}

export interface CheckoutSessionData {
  client_secret: string;
  payment_intent_id: string;
}

export interface CheckoutSessionResponse {
  message: string;
  status_code: number;
  data: {
    checkout_session: CheckoutSessionData;
  };
}

export interface BillingPortalSession {
  id: string;
  object: string;
  configuration: string;
  created: number;
  customer: string;
  customer_account: string | null;
  flow: string | null;
  livemode: boolean;
  locale: string | null;
  on_behalf_of: string | null;
  return_url: string;
  url: string;
}

export interface BillingPortalResponse {
  message: string;
  status_code: number;
  data: {
    session: BillingPortalSession;
  };
}

// Invoice Types
export interface InvoiceLineItem {
  id: string;
  object: string;
  amount: number;
  currency: string;
  description: string;
  quantity: number;
  period: {
    start: number;
    end: number;
  };
}

export interface Invoice {
  id: string;
  object: string;
  account_name: string;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  billing_reason: string;
  collection_method: string;
  created: number;
  currency: string;
  customer: string;
  customer_email: string | null;
  customer_name: string | null;
  hosted_invoice_url: string;
  invoice_pdf: string;
  number: string;
  status: "draft" | "open" | "paid" | "uncollectible" | "void";
  status_transitions: {
    finalized_at: number | null;
    marked_uncollectible_at: number | null;
    paid_at: number | null;
    voided_at: number | null;
  };
  subtotal: number;
  total: number;
  lines: {
    object: string;
    data: InvoiceLineItem[];
    has_more: boolean;
    total_count: number;
  };
}

export interface InvoicesResponse {
  message: string;
  status_code: number;
  data: {
    invoices: {
      object: string;
      data: Invoice[];
      has_more: boolean;
      url: string;
    };
  };
}

export type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed';

export interface PaymentError {
  message: string;
  code?: string;
}





