// Blast API Types

export interface BlastOTPRequest {
  message: string;
  phone_numbers: string[];
  business_id: string;
}

export interface BlastOTPResponse {
  message: string;
  data: {
    message: string;
    data: {
      usage_cache: {
        id: string;
        current_count: number;
        current_cost: number;
        period_start: string;
        period_end: string;
        balance: number;
        metadata: {
          balance: number;
          previous_balance: number;
          new_balance: number;
          balance_difference: number;
        };
        business: {
          id: string;
          name: string;
        };
        config_type: {
          id: string;
          name: string;
        };
      };
      otp_response: {
        code: number;
        desc: string;
        to: string;
        ref: string;
      };
    };
  };
}

export interface BlastVariable {
  variable: string;
  description: string;
}

export interface BlastVariablesResponse {
  message: string;
  data: {
    variables: BlastVariable[];
  };
}






