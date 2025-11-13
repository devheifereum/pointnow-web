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

