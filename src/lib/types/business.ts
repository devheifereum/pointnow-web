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
  business_images?: BusinessImage[];
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
  country_code?: string;
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
  email?: string | null;
  phone_number?: string | null;
  business_images?: BusinessImage[];
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
  id?: string;
  image_url: string;
}

export interface UpdateBusinessPayload {
  name?: string;
  description?: string;
  business_images?: BusinessImage[];
}

export interface UpdateBusinessResponse {
  message: string;
  status_code: number;
  data: {
    business: BusinessDetail;
  };
}

export interface Region {
  id: string;
  name: string;
  country_code: string;
}

export interface TrendingBusiness extends Business {
  total_customers: number;
  regions: Region[];
}

export interface TrendingBusinessesResponse {
  message: string;
  status_code: number;
  data: {
    businesses: TrendingBusiness[];
    metadata: BusinessesMetadata;
  };
}

