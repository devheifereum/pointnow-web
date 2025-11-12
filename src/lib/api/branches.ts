import { api } from "./client";
import type {
  BranchesResponse,
  BranchesParams,
  CreateBranchPayload,
  CreateBranchResponse,
  UpdateBranchPayload,
  UpdateBranchResponse,
  DeleteBranchResponse,
} from "../types/branches";

export const branchesApi = {
  getAll: async (params: BranchesParams): Promise<BranchesResponse> => {
    const queryParams = new URLSearchParams({
      business_id: params.business_id,
    });

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    return api.get<BranchesResponse>(`/branchs?${queryParams}`);
  },

  create: async (payload: CreateBranchPayload): Promise<CreateBranchResponse> => {
    return api.post<CreateBranchResponse>("/branchs", payload);
  },

  update: async (branchId: string, payload: UpdateBranchPayload): Promise<UpdateBranchResponse> => {
    return api.patch<UpdateBranchResponse>(`/branchs/${branchId}`, payload);
  },

  delete: async (branchId: string): Promise<DeleteBranchResponse> => {
    return api.delete<DeleteBranchResponse>(`/branchs/${branchId}`);
  },
};

