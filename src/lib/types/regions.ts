export interface RegionCountryCode {
  country_code: string;
  name: string;
}

export interface RegionsMetadata {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface RegionsCountryCodeResponse {
  message: string;
  status_code: number;
  data: {
    regions: RegionCountryCode[];
    metadata: RegionsMetadata;
  };
}



