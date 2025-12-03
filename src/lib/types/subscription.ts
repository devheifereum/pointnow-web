export interface SubscriptionProduct {
  id: string;
  link: string;
  price_id: string;
  price: number;
  duration: "MONTHLY" | "YEARLY";
  is_trial: boolean;
  subscription_type_id: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionMetadata {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface SubscriptionProductsResponse {
  message: string;
  status_code: number;
  data: {
    subscription_products: SubscriptionProduct[];
    metadata: SubscriptionMetadata;
  };
}

export interface SubscriptionProductsParams {
  page?: number;
  limit?: number;
  is_trial?: boolean;
}

// Subscription Type
export interface SubscriptionType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionTypeResponse {
  message: string;
  status_code: number;
  data: {
    subscription_type: SubscriptionType;
  };
}

// Active Subscription
export interface Subscription {
  id: string;
  subscription_provider_id: string;
  subscription_type_id: string;
  business_id: string;
  email: string;
  customer_id: string;
  product_id: string;
  start_date: string;
  end_date: string;
  cancelled_at: string | null;
  metadata: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActiveSubscriptionResponse {
  message: string;
  status_code: number;
  data: {
    subscription: Subscription | null;
  };
}

export interface ActiveSubscriptionParams {
  provider_name: string;
  business_id: string;
}

