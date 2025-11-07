export interface LeaderboardMetadata {
  total_customers: number;
  total_points: number;
  total_visits: number;
}

export interface LeaderboardMetadataResponse {
  message: string;
  status_code: number;
  data: {
    metadata: LeaderboardMetadata;
  };
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  points?: number;
  visits?: number;
  created_at?: string;
  updated_at?: string;
  last_visit?: string;
  [key: string]: unknown;
}

export interface CustomersMetadata {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface CustomersResponse {
  message: string;
  status_code: number;
  data: {
    customers: Customer[];
    metadata: CustomersMetadata;
  };
}

export interface CustomersParams {
  business_id: string;
  page?: number;
  limit?: number;
}

export interface CreateCustomerWithUserPayload {
  name: string;
  email: string;
  phone_number: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
  business: {
    business_id: string;
    staff_id: string;
    metadata: Record<string, unknown>;
    is_active: boolean;
    total_points: number;
  };
}

export interface CreateCustomerWithUserResponse {
  message: string;
  status_code: number;
  data: {
    customer: Customer;
    [key: string]: unknown;
  };
}
