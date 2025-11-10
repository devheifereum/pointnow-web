import { api } from "./client";
import type {
  AnalyticsMetadataResponse,
  TopCustomersResponse,
  PointHistoricalDataResponse,
  AnalyticsParams,
} from "../types/analytics";

export const analyticsApi = {
  // Analytics Business endpoints
  getMetadata: async (params: Pick<AnalyticsParams, 'business_id'>): Promise<AnalyticsMetadataResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
    });
    return api.get<AnalyticsMetadataResponse>(`/analytics/business/leaderboard/metadata?${queryParams}`);
  },

  getTopCustomers: async (params: Pick<AnalyticsParams, 'business_id'>): Promise<TopCustomersResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
    });
    return api.get<TopCustomersResponse>(`/analytics/business/leaderboard/customers?${queryParams}`);
  },

  getPointHistoricalData: async (
    params: AnalyticsParams
  ): Promise<PointHistoricalDataResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
      start_date: params.start_date,
      end_date: params.end_date,
    });
    return api.get<PointHistoricalDataResponse>(
      `/analytics/business/leaderboard/points/historical-data?${queryParams}`
    );
  },

  // Analytics Customers endpoints
  getCustomerMetadata: async (params: Omit<AnalyticsParams, 'business_id'> & { customer_id: string }): Promise<AnalyticsMetadataResponse> => {
    const queryParams = new URLSearchParams({
      customer_id: params.customer_id,
      start_date: params.start_date,
      end_date: params.end_date,
    });
    return api.get<AnalyticsMetadataResponse>(`/analytics/leaderboard/customer/metadata?${queryParams}`);
  },

  getCustomerPointHistoricalData: async (
    params: Omit<AnalyticsParams, 'business_id'> & { customer_id: string }
  ): Promise<PointHistoricalDataResponse> => {
    const queryParams = new URLSearchParams({
      customer_id: params.customer_id,
      start_date: params.start_date,
      end_date: params.end_date,
    });
    return api.get<PointHistoricalDataResponse>(
      `/analytics/leaderboard/customer/points/historical-data?${queryParams}`
    );
  },
};
