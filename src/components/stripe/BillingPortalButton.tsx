"use client";

import React, { useState } from "react";
import { Loader2, ExternalLink, Settings } from "lucide-react";
import { paymentApi } from "@/lib/api/payment";

interface BillingPortalButtonProps {
  businessId: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export default function BillingPortalButton({
  businessId,
  variant = "secondary",
  size = "md",
  className = "",
  children,
}: BillingPortalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!businessId) {
      setError("Business ID is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await paymentApi.createBillingPortalSession(businessId);
      
      if (response.data?.session?.url) {
        // Open billing portal in a new tab
        window.open(response.data.session.url, "_blank");
      } else {
        throw new Error("Invalid billing portal response");
      }
    } catch (err) {
      console.error("Failed to open billing portal:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to open billing portal"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[#7bc74d] text-white hover:bg-[#6ab63d] shadow-lg shadow-[#7bc74d]/25",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={isLoading || !businessId}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Settings className="w-4 h-4" />
        )}
        {children || "Manage Subscription"}
        <ExternalLink className="w-3 h-3 opacity-60" />
      </button>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}







