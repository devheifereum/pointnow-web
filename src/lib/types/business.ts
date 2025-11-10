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

