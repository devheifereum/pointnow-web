export interface Business {
  id: string;
  name: string;
  description?: string;
  registration_number: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessesMetadata {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface BusinessesResponse {
  message: string;
  status_code: number;
  data: {
    businesses: Business[];
    metadata: BusinessesMetadata;
  };
}

export interface BusinessesParams {
  page?: number;
  limit?: number;
  query?: string;
}

export interface BusinessAdmin {
  id: string;
  user_id: string;
  business_id: string;
  level: string;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessStaff {
  id: string;
  business_id: string;
  user_id: string;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessDetail extends Business {
  status?: string;
  admins?: BusinessAdmin[];
  staffs?: BusinessStaff[];
}

export interface BusinessDetailResponse {
  message: string;
  status_code: number;
  data: {
    business: BusinessDetail;
  };
}

export interface BusinessImage {
  image_url: string;
}

export interface UpdateBusinessPayload {
  business_images?: BusinessImage[];
}

export interface UpdateBusinessResponse {
  message: string;
  status_code: number;
  data: {
    business: BusinessDetail;
  };
}

