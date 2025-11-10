import { api } from "./client";
import type { BusinessesResponse, BusinessesParams } from "../types/business";

export const businessApi = {
  getAll: async (params?: BusinessesParams): Promise<BusinessesResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    return api.get<BusinessesResponse>(`/business${queryString ? `?${queryString}` : ""}`);
  },

  search: async (params?: BusinessesParams): Promise<BusinessesResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.query) {
      queryParams.append("query", params.query);
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    return api.get<BusinessesResponse>(`/business/search${queryString ? `?${queryString}` : ""}`);
  },
};