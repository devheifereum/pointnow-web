"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";

interface CheckoutFormProps {
  amount: number;
  currency: string;
  returnUrl: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function CheckoutForm({
  amount,
  currency,
  returnUrl,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatPrice = (price: number, curr: string) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Submit the Elements form first
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || "Payment submission failed");
        setIsProcessing(false);
        onError?.(submitError.message || "Payment submission failed");
        return;
      }

      // Confirm the payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      });

      if (error) {
        // This will only be reached if there's an immediate error
        // For redirect-based payment methods, the customer will be redirected
        setErrorMessage(error.message || "Payment failed");
        onError?.(error.message || "Payment failed");
      } else {
        // Payment succeeded or requires additional action
        onSuccess?.();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#7bc74d]/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#7bc74d]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total amount</p>
              <p className="text-xl font-bold text-black">
                {formatPrice(amount, currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div className="space-y-4">
        <PaymentElement
          options={{
            layout: "tabs",
            business: {
              name: "PointNow",
            },
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
          !stripe || isProcessing
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#7bc74d] hover:bg-[#6ab63d] shadow-lg shadow-[#7bc74d]/25"
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay {formatPrice(amount, currency)}
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4" />
        <span>Secured by Stripe. Your payment info is encrypted.</span>
      </div>
    </form>
  );
}

