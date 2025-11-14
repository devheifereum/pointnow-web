import { api } from "./client";
import type { BusinessesResponse, BusinessesParams, BusinessDetailResponse, UpdateBusinessPayload, UpdateBusinessResponse } from "../types/business";

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

  getById: async (businessId: string): Promise<BusinessDetailResponse> => {
    return api.get<BusinessDetailResponse>(`/business/${businessId}`);
  },

  update: async (businessId: string, payload: UpdateBusinessPayload): Promise<UpdateBusinessResponse> => {
    return api.patch<UpdateBusinessResponse>(`/business/${businessId}`, payload);
  },
};