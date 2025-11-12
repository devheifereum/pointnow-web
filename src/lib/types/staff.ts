export interface StaffUser {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  metadata?: Record<string, unknown>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
  id: string;
  business_id: string;
  user_id: string;
  metadata?: Record<string, unknown>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  user: StaffUser;
}

export interface StaffsParams {
  page?: number;
  limit?: number;
}

export interface StaffsResponse {
  message: string;
  status_code: number;
  data: {
    staffs: Staff[];
    metadata: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
  };
}

export interface CreateStaffPayload {
  email: string;
  name: string;
  phone_number: string;
  business_id: string;
}

export interface CreateStaffResponse {
  message: string;
  status_code: number;
  data: {
    staff: Staff;
  };
}

export interface DeleteStaffResponse {
  message: string;
  status_code: number;
}

