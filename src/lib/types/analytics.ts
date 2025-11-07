export interface AnalyticsMetadata {
  total_customers?: number;
  total_points_issued?: number;
  points_redeemed?: number;
  active_this_month?: number;
  [key: string]: unknown;
}

export interface AnalyticsMetadataResponse {
  message?: string;
  status: number;
  data: AnalyticsMetadata;
}

export interface TopCustomer {
  id: string;
  name: string;
  email?: string;
  points: number;
  visits: number;
  rank?: number;
  [key: string]: unknown;
}

export interface TopCustomersResponse {
  message?: string;
  status: number;
  data: TopCustomer[];
}

export interface PointHistoricalDataPoint {
  date: string;
  points_issued: number;
  points_redeemed: number;
  net_points: number;
  [key: string]: unknown;
}

export interface PointHistoricalDataResponse {
  message?: string;
  status: number;
  data: PointHistoricalDataPoint[];
}

export interface AnalyticsParams {
  business_id: string;
  start_date: string;
  end_date: string;
}
