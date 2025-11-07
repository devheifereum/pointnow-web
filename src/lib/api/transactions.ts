import { api } from "./client";
import type {
  TransactionMetadataResponse,
  TransactionsResponse,
  TransactionsParams,
  CreatePointTransactionPayload,
  CreatePointTransactionResponse,
} from "../types/transactions";

export const transactionsApi = {
  getMetadata: async (businessId: string): Promise<TransactionMetadataResponse> => {
    const queryParams = new URLSearchParams({
      business_id: businessId,
    });
    return api.get<TransactionMetadataResponse>(`/point_transactions/metadata?${queryParams}`);
  },

  getAll: async (params: TransactionsParams): Promise<TransactionsResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
      with_customer_detail: "true",
      with_staff_detail: "true",
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

    return api.get<TransactionsResponse>(`/point_transactions?${queryParams}`);
  },

  create: async (payload: CreatePointTransactionPayload): Promise<CreatePointTransactionResponse> => {
    return api.post<CreatePointTransactionResponse>("/point_transactions", payload);
  },
};