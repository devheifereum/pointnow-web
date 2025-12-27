import { api } from "./client";
import type { UsageCachesResponse, UsageCachesParams } from "../types/wallet";

export const walletApi = {
  /**
   * Get usage caches (wallet balance) for a business
   * @param params - Query parameters including business_id, page, limit, etc.
   * @returns Usage caches with balance information
   */
  getUsageCaches: async (params: UsageCachesParams): Promise<UsageCachesResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
    });

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params.config_type_id) {
      queryParams.append("config_type_id", params.config_type_id);
    }
    if (params.with_business !== undefined) {
      queryParams.append("with_business", params.with_business.toString());
    }
    if (params.with_config_type !== undefined) {
      queryParams.append("with_config_type", params.with_config_type.toString());
    }

    return api.get<UsageCachesResponse>(`/usage-caches?${queryParams}`);
  },
};





