// Config Types API Types

export interface ConfigType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  charge: number;
  created_at: string;
  updated_at: string;
}

export interface ConfigTypesMetadata {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ConfigTypesResponse {
  message: string;
  status_code: number;
  data: {
    config_types: ConfigType[];
    metadata: ConfigTypesMetadata;
  };
}

export interface ConfigTypesParams {
  name?: string;
  page?: number;
  limit?: number;
}



