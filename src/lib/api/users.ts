import { api } from "./client";
import type {
  UpdateUserRequest,
  UpdateUserResponse,
} from "../types/auth";

export const usersApi = {
  updateUser: async (
    userId: string,
    data: UpdateUserRequest
  ): Promise<UpdateUserResponse> => {
    return api.patch<UpdateUserResponse>(`/users/${userId}`, data);
  },
};

