import { api } from "./client";
import type {
  SubscriptionProductsResponse,
  SubscriptionProductsParams,
  SubscriptionTypeResponse,
  ActiveSubscriptionResponse,
  ActiveSubscriptionParams,
} from "../types/subscription";

export const subscriptionApi = {
  getProducts: async (params?: SubscriptionProductsParams): Promise<SubscriptionProductsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.is_trial !== undefined) {
      queryParams.append("is_trial", params.is_trial.toString());
    }

    const queryString = queryParams.toString();
    return api.get<SubscriptionProductsResponse>(`/subscription/products${queryString ? `?${queryString}` : ""}`);
  },

  getTypeById: async (typeId: string): Promise<SubscriptionTypeResponse> => {
    return api.get<SubscriptionTypeResponse>(`/subscription/types/${typeId}`);
  },

  getActiveByBusinessId: async (params: ActiveSubscriptionParams): Promise<ActiveSubscriptionResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("provider_name", params.provider_name);
    queryParams.append("business_id", params.business_id);

    return api.get<ActiveSubscriptionResponse>(`/subscriptions/active/business?${queryParams.toString()}`);
  },
};



