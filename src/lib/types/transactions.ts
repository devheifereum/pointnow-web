export interface TransactionMetadata {
  total_transactions: number;
  total_points_added: number;
  total_points_subtracted: number;
}

export interface TransactionMetadataResponse {
  message: string;
  status_code: number;
  data: {
    metadata: TransactionMetadata;
  };
}

export interface CustomerDetail {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  [key: string]: unknown;
}

export interface StaffUser {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  [key: string]: unknown;
}

export interface StaffDetail {
  id: string;
  user: StaffUser;
  [key: string]: unknown;
}

export interface CustomerBusiness {
  customer: CustomerDetail;
  [key: string]: unknown;
}

export interface PointTransaction {
  id: string;
  customer_business_id: string;
  amount: number; // Can be positive (earned) or negative (redeemed)
  type: "EARN" | "REDEEM" | "ADD" | "SUBTRACT";
  staff_id?: string;
  metadata?: Record<string, unknown>;
  is_active: boolean;
  transaction_at: string;
  created_at: string;
  updated_at: string;
  // Nested objects when with_customer_detail and with_staff_detail are true
  customer_business?: CustomerBusiness;
  staff?: StaffDetail;
  // Optional fields that might be populated from joins (legacy support)
  customer_name?: string;
  customer_phone?: string;
  staff_member?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface TransactionsMetadata {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface TransactionsResponse {
  message: string;
  status_code: number;
  data: {
    point_transactions: PointTransaction[];
    metadata: TransactionsMetadata;
  };
}

export interface TransactionsParams {
  business_id: string;
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}

export interface CreatePointTransactionPayload {
  business_id: string;
  customer_id: string;
  branch_id: string;
  amount: number;
  employee_id: string;
}

export interface CreatePointTransactionResponse {
  message: string;
  status_code: number;
  data: {
    point_transaction: {
      id: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}
