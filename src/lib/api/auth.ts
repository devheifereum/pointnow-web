import { api } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  UserRegisterRequest,
  RegisterResponse,
  BusinessRegisterRequest,
  PhoneRegisterRequest,
  PhoneRegisterResponse,
  PhoneLoginRequest,
  PhoneLoginResponse,
  VerifyOTPRequest,
  VerifyRegisterOTPResponse,
  VerifyLoginOTPResponse,
} from "../types/auth";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/login", credentials);
  },

  loginWithPhone: async (
    data: PhoneLoginRequest
  ): Promise<PhoneLoginResponse> => {
    return api.post<PhoneLoginResponse>("/auth/login/phone_number", data);
  },

  verifyLoginOTP: async (
    data: VerifyOTPRequest
  ): Promise<VerifyLoginOTPResponse> => {
    return api.post<VerifyLoginOTPResponse>("/auth/verify/login/phone_number/otp", data);
  },

  registerUser: async (data: UserRegisterRequest): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/auth/register", data);
  },

  registerUserWithPhone: async (
    data: PhoneRegisterRequest
  ): Promise<PhoneRegisterResponse> => {
    return api.post<PhoneRegisterResponse>("/auth/register/phone_number", data);
  },

  verifyRegisterOTP: async (
    data: VerifyOTPRequest
  ): Promise<VerifyRegisterOTPResponse> => {
    return api.post<VerifyRegisterOTPResponse>("/auth/verify/register/phone_number/otp", data);
  },

  registerBusiness: async (
    data: BusinessRegisterRequest
  ): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/auth/register/business", data);
  },
};
