export interface RecentCustomer {
  id: string;
  email: string;
  name: string;
  phone_number: string;
}

export interface AnalyticsMetadata {
  total_customers: number;
  total_points: number;
  total_active_customers: number;
  recent_customers: RecentCustomer;
}

export interface AnalyticsMetadataResponse {
  message: string;
  status_code: number;
  data: {
    metadata: AnalyticsMetadata;
  };
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  total_points: number;
  total_visits: number;
  last_visit_at: string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface TopCustomersResponse {
  message: string;
  status_code: number;
  data: {
    customers: TopCustomer[];
    metadata: PaginationMetadata;
  };
}

export interface PointHistoricalDataPoint {
  count: number;
  total_points: number;
  date: string;
}

export interface PointHistoricalDataResponse {
  message: string;
  status_code: number;
  data: {
    historical_data: PointHistoricalDataPoint[];
  };
}

export interface AnalyticsParams {
  business_id: string;
  start_date: string;
  end_date: string;
}
