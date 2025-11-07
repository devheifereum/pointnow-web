import { api } from "./client";
import type {
  AnalyticsMetadataResponse,
  TopCustomersResponse,
  PointHistoricalDataResponse,
  AnalyticsParams,
} from "../types/analytics";

export const analyticsApi = {
  getMetadata: async (params: AnalyticsParams): Promise<AnalyticsMetadataResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
      start_date: params.start_date,
      end_date: params.end_date,
    });
    return api.get<AnalyticsMetadataResponse>(`/analytics/leaderboard/metadata?${queryParams}`);
  },

  getTopCustomers: async (params: AnalyticsParams): Promise<TopCustomersResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
      start_date: params.start_date,
      end_date: params.end_date,
    });
    return api.get<TopCustomersResponse>(`/analytics/leaderboard/customers?${queryParams}`);
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
      `/analytics/leaderboard/points/historical-data?${queryParams}`
    );
  },
};
