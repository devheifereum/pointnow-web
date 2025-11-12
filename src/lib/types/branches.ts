export interface Branch {
  id: string;
  name: string;
  business_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface BranchesParams {
  business_id: string;
  page?: number;
  limit?: number;
}

export interface BranchesResponse {
  message: string;
  status: number;
  data: {
    branches: Branch[];
    metadata: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  };
}

export interface CreateBranchPayload {
  name: string;
  business_id: string;
}

export interface CreateBranchResponse {
  message: string;
  status: number;
  data: {
    branch: Branch;
  };
}

export interface UpdateBranchPayload {
  name?: string;
}

export interface UpdateBranchResponse {
  message: string;
  status: number;
  data: {
    branch: Branch;
  };
}

export interface DeleteBranchResponse {
  message: string;
  status: number;
}

