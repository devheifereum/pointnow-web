import { api } from "./client";
import type { BlastOTPRequest, BlastOTPResponse } from "../types/blast";

export const blastApi = {
  /**
   * Send OTP/message blast to phone numbers
   * @param payload - Blast request with message, phone numbers, and business ID
   * @returns Blast response with usage cache and OTP response
   */
  sendOTP: async (payload: BlastOTPRequest): Promise<BlastOTPResponse> => {
    return api.post<BlastOTPResponse>("/blast/otp", payload);
  },
};


