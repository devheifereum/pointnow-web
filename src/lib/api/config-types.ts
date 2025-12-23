import { api } from "./client";
import type { ConfigTypesResponse, ConfigTypesParams } from "../types/config-types";

export const configTypesApi = {
  /**
   * Get config types (e.g., SMS rates)
   * @param params - Query parameters including name, page, limit
   * @returns Config types with rates
   */
  getAll: async (params?: ConfigTypesParams): Promise<ConfigTypesResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.name) {
      queryParams.append("name", params.name);
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    return api.get<ConfigTypesResponse>(`/config-types${queryString ? `?${queryString}` : ""}`);
  },
};

