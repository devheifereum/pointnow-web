import { api } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  UserRegisterRequest,
  RegisterResponse,
  BusinessRegisterRequest,
} from "../types/auth";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/login", credentials);
  },

  registerUser: async (data: UserRegisterRequest): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/auth/register", data);
  },

  registerBusiness: async (
    data: BusinessRegisterRequest
  ): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/auth/register/business", data);
  },
};
