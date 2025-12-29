// Wallet/Usage Cache API Types

export interface UsageCacheMetadata {
  amount: number;
  currency: string;
  new_balance: number;
  previous_balance: number;
  payment_intent_id: string;
  balance_difference: number;
}

export interface BusinessInfo {
  id: string;
  name: string;
}

export interface ConfigTypeInfo {
  id: string;
  name: string;
}

export interface UsageCache {
  id: string;
  business_id: string;
  config_type_id: string;
  current_count: number;
  current_cost: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
  balance: number;
  metadata: UsageCacheMetadata;
  businesses?: BusinessInfo;
  config_types?: ConfigTypeInfo;
}

export interface UsageCachesMetadata {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface UsageCachesResponse {
  message: string;
  status_code: number;
  data: {
    usage_caches: UsageCache[];
    metadata: UsageCachesMetadata;
  };
}

export interface UsageCachesParams {
  business_id: string;
  page?: number;
  limit?: number;
  config_type_id?: string;
  with_business?: boolean;
  with_config_type?: boolean;
}






