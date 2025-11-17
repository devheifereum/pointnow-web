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
  points?: number; // Legacy field, use total_points for leaderboard
  total_points?: number; // From leaderboard API
  visits?: number; // Legacy field, use total_visits for leaderboard
  total_visits?: number; // From leaderboard API
  created_at?: string;
  updated_at?: string;
  last_visit?: string; // Legacy field, use last_visit_at for leaderboard
  last_visit_at?: string; // From leaderboard API
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

export interface CustomersSearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface LeaderboardParams {
  business_id: string;
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}

export interface CreateCustomerWithUserPayload {
  name: string;
  email: string;
  phone_number: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
  business: {
    business_id: string;
    branch_id: string;
    employee_id: string;
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

export interface CustomerPosition {
  total_points: number;
  total_visits: number;
  last_visit_at: string;
  position: number;
  joined_at: string;
}

export interface CustomerPositionResponse {
  message: string;
  status_code: number;
  data: {
    position: CustomerPosition;
  };
}

export interface CustomerPositionParams {
  business_id: string;
  customer_id: string;
}

export interface UserProfileBusiness {
  id: string;
  name: string;
}

export interface UserProfileCustomerBusiness {
  customer_business_id: string;
  total_points: number;
  total_visits: number;
  last_visit_at: string;
  business: UserProfileBusiness;
  customer: Customer;
}

export interface UserProfileMetadata {
  total_businesses: number;
  total_points: number;
  total_visits: number;
  recent_visted_business: UserProfileBusiness;
}

export interface UserProfileData {
  user: {
    id: string;
    email: string;
    name: string;
    phone_number: string;
    customer: Customer;
  };
  metadata: UserProfileMetadata;
  customer_businesses: UserProfileCustomerBusiness[];
}

export interface UserProfileResponse {
  message: string;
  status_code: number;
  data: UserProfileData;
}
