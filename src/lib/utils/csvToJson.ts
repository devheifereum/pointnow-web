import * as XLSX from 'xlsx';
import type { CreateCustomerWithUserBatchPayload } from '../types/customers';

export interface CSVRow {
  name?: string;
  email?: string;
  phone_number?: string;
  phone?: string;
  'phone number'?: string;
  [key: string]: string | undefined;
}

export interface ParsedCustomer {
  name: string;
  email: string;
  phone_number: string;
  business_id: string;
}

export interface CSVParseResult {
  success: boolean;
  data?: ParsedCustomer[];
  errors?: string[];
}

/**
 * Converts CSV file to JSON array of customer data
 * Expected CSV columns: name, email, phone_number (or phone, phone number)
 */
export function csvToJson(
  file: File,
  businessId: string
): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const errors: string[] = [];

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({
            success: false,
            errors: ['Failed to read file'],
          });
          return;
        }

        // Parse CSV using XLSX
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: CSVRow[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
        });

        if (jsonData.length === 0) {
          resolve({
            success: false,
            errors: ['CSV file is empty'],
          });
          return;
        }

        // Normalize column names (case-insensitive, handle variations)
        const normalizedData: ParsedCustomer[] = [];
        
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          const rowNumber = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

          // Find name column (case-insensitive)
          const nameKey = Object.keys(row).find(
            (key) => key.toLowerCase().trim() === 'name'
          );
          const name = nameKey ? String(row[nameKey] || '').trim() : '';

          // Find email column (case-insensitive)
          const emailKey = Object.keys(row).find(
            (key) => key.toLowerCase().trim() === 'email'
          );
          const email = emailKey ? String(row[emailKey] || '').trim() : '';

          // Find phone column (case-insensitive, handle variations)
          const phoneKey = Object.keys(row).find(
            (key) =>
              key.toLowerCase().trim() === 'phone_number' ||
              key.toLowerCase().trim() === 'phone number' ||
              key.toLowerCase().trim() === 'phone'
          );
          let phone_number = phoneKey ? String(row[phoneKey] || '').trim() : '';
          
          // Remove + sign from phone number if present
          if (phone_number.startsWith('+')) {
            phone_number = phone_number.substring(1);
          }

          // Validate required fields
          if (!name) {
            errors.push(`Row ${rowNumber}: Name is required`);
            continue;
          }

          if (!email) {
            errors.push(`Row ${rowNumber}: Email is required`);
            continue;
          }

          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            errors.push(`Row ${rowNumber}: Invalid email format: ${email}`);
            continue;
          }

          if (!phone_number) {
            errors.push(`Row ${rowNumber}: Phone number is required`);
            continue;
          }

          normalizedData.push({
            name,
            email,
            phone_number,
            business_id: businessId,
          });
        }

        if (normalizedData.length === 0 && errors.length > 0) {
          resolve({
            success: false,
            errors,
          });
          return;
        }

        resolve({
          success: true,
          data: normalizedData,
          errors: errors.length > 0 ? errors : undefined,
        });
      } catch (error) {
        resolve({
          success: false,
          errors: [
            `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        errors: ['Failed to read file'],
      });
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Converts parsed customer data to batch payload format
 */
export function convertToBatchPayload(
  customers: ParsedCustomer[]
): CreateCustomerWithUserBatchPayload[] {
  return customers.map((customer) => ({
    name: customer.name,
    email: customer.email,
    phone_number: customer.phone_number,
    business: {
      business_id: customer.business_id,
    },
  }));
}
