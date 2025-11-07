export type UserRole = "ADMIN" | "STAFF" | "USER" | "CUSTOMER";

export interface Role {
  name: UserRole;
}

export interface UserRoleRelation {
  role: Role;
}

export interface Admin {
  business_id: string;
}

export interface Staff {
  business_id: string;
}

export interface Customer {
  name: string;
  phone_number: string;
  email: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
  is_active: boolean;
  admin: Admin | null;
  staff: Staff | null;
  customer: Customer | null;
  user_roles: UserRoleRelation[];
}

export interface BackendTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginResponse {
  message: string;
  status: number;
  data: {
    user: User;
    backend_tokens: BackendTokens;
  };
}

export interface RegisterResponse {
  message: string;
  status: number;
  data: {
    user: User;
    backend_tokens: BackendTokens;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  phone_number: string;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
  role: "CUSTOMER";
}

export interface BusinessRegisterRequest {
  email: string;
  password: string;
  phone: string;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
  role: "ADMIN";
  business: {
    name: string;
    registration_number: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    metadata?: Record<string, unknown>;
    is_active?: boolean;
  };
}

export interface AuthUser {
  user: User;
  tokens: BackendTokens;
  roles: UserRole[];
  businessId: string | null;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
}
