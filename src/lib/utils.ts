import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.trim();
  
  // If already starts with +60, return as is
  if (cleaned.startsWith('+60')) {
    return cleaned;
  }
  
  // Remove + prefix if present for processing
  const withoutPlus = cleaned.replace(/^\+/, '');
  
  // If starts with 60, add + prefix
  if (withoutPlus.startsWith('60')) {
    return `+${withoutPlus}`;
  }

  // If starts with 0, replace with +60
  if (withoutPlus.startsWith('0')) {
    return `+60${withoutPlus.substring(1)}`;
  }

  // If already has + prefix (other country codes), return as is
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // Fallback: return as is
  return cleaned;
}
