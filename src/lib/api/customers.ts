import { api } from "./client";
import type {
  LeaderboardMetadataResponse,
  CustomersResponse,
  CustomersParams,
  LeaderboardParams,
  CreateCustomerWithUserPayload,
  CreateCustomerWithUserResponse,
  CustomerPositionResponse,
  CustomerPositionParams,
  UserProfileResponse,
} from "../types/customers";

export const customersApi = {
  getLeaderboardMetadata: async (businessId: string): Promise<LeaderboardMetadataResponse> => {
    const queryParams = new URLSearchParams({
      business_id: businessId,
    });
    return api.get<LeaderboardMetadataResponse>(`/customers/leaderboard/metadata?${queryParams}`);
  },

  getAll: async (params: CustomersParams): Promise<CustomersResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
    });

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    return api.get<CustomersResponse>(`/customers?${queryParams}`);
  },

  getLeaderboard: async (params: LeaderboardParams): Promise<CustomersResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
    });

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    return api.get<CustomersResponse>(`/customers/leaderboard?${queryParams}`);
  },

  createWithUser: async (payload: CreateCustomerWithUserPayload): Promise<CreateCustomerWithUserResponse> => {
    return api.post<CreateCustomerWithUserResponse>("/customers/user", payload);
  },

  getPosition: async (params: CustomerPositionParams): Promise<CustomerPositionResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
      customer_id: params.customer_id,
    });
    return api.get<CustomerPositionResponse>(`/customers/position?${queryParams}`);
  },

  getUserProfile: async (userId: string): Promise<UserProfileResponse> => {
    return api.get<UserProfileResponse>(`/users/profile/${userId}`);
  },
};
