import { api } from "./client";
import type {
  StaffsResponse,
  StaffsParams,
  CreateStaffPayload,
  CreateStaffResponse,
  DeleteStaffResponse,
} from "../types/staff";

export const staffApi = {
  getAll: async (businessId: string, params?: StaffsParams): Promise<StaffsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    const url = `/staffs/business/${businessId}${queryString ? `?${queryString}` : ""}`;
    
    return api.get<StaffsResponse>(url);
  },

  create: async (payload: CreateStaffPayload): Promise<CreateStaffResponse> => {
    return api.post<CreateStaffResponse>("/staffs/user", payload);
  },

  delete: async (staffId: string): Promise<DeleteStaffResponse> => {
    return api.delete<DeleteStaffResponse>(`/staffs/${staffId}`);
  },
};

