import { api } from "./client";
import type {
  LeaderboardMetadataResponse,
  CustomersResponse,
  CustomersParams,
  CreateCustomerWithUserPayload,
  CreateCustomerWithUserResponse,
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

  createWithUser: async (payload: CreateCustomerWithUserPayload): Promise<CreateCustomerWithUserResponse> => {
    return api.post<CreateCustomerWithUserResponse>("/customers/user", payload);
  },
};
