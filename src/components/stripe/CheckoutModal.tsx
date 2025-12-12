"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getStripe,
  stripeElementsAppearance,
  getReturnUrl,
} from "@/lib/stripe/config";
import { paymentApi } from "@/lib/api/payment";
import CheckoutForm from "./CheckoutForm";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  amount: number;
  currency?: string;
  planName?: string;
  paymentType?: string;
  onPaymentSuccess?: () => void;
}

type ModalState = "loading" | "ready" | "success" | "error";

export default function CheckoutModal({
  isOpen,
  onClose,
  businessId,
  businessName,
  amount,
  currency = "MYR",
  planName = "Messaging Credits",
  paymentType = "topup",
  onPaymentSuccess,
}: CheckoutModalProps) {
  const [modalState, setModalState] = useState<ModalState>("loading");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stripePromise = getStripe();

  const initializeCheckout = useCallback(async () => {
    if (!isOpen || !businessId) return;

    setModalState("loading");
    setErrorMessage(null);

    try {
      // Validate minimum amount (RM2.00 = 200 cents)
      if (amount < 2) {
        throw new Error("Amount must be at least RM2.00");
      }

      // Convert amount to cents (smallest currency unit)
      // Backend expects amount in cents: RM80 = 8000 cents
      const amountInCents = Math.round(amount * 100);

      const response = await paymentApi.createCheckoutSession({
        business_id: businessId,
        currency: currency,
        amount: amountInCents,
      });

      if (response.data?.checkout_session?.client_secret) {
        setClientSecret(response.data.checkout_session.client_secret);
        setModalState("ready");
      } else {
        throw new Error("Invalid checkout session response");
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to initialize payment. Please try again."
      );
      setModalState("error");
    }
  }, [isOpen, businessId, amount, currency]);

  useEffect(() => {
    if (isOpen) {
      initializeCheckout();
    } else {
      // Reset state when modal closes
      setClientSecret(null);
      setModalState("loading");
      setErrorMessage(null);
    }
  }, [isOpen, initializeCheckout]);

  const handlePaymentSuccess = () => {
    setModalState("success");
    onPaymentSuccess?.();
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
  };

  const handleClose = () => {
    if (modalState !== "loading") {
      onClose();
    }
  };

  const returnUrl = getReturnUrl(businessName, paymentType);
  const isTopup = paymentType === "topup";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={modalState !== "loading"}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-gilroy-black">
            {modalState === "success"
              ? "Payment Successful!"
              : isTopup
              ? `Top Up ${planName}`
              : `Upgrade to ${planName}`}
          </DialogTitle>
          <DialogDescription>
            {modalState === "success"
              ? isTopup
                ? "Your credits have been added to your wallet."
                : "Your subscription has been activated."
              : isTopup
              ? "Complete your payment to add messaging credits."
              : "Complete your payment to unlock all features."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Loading State */}
          {modalState === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-[#7bc74d] mb-4" />
              <p className="text-gray-600">Preparing checkout...</p>
            </div>
          )}

          {/* Error State */}
          {modalState === "error" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-gray-900 font-semibold mb-2">
                Unable to load payment
              </p>
              <p className="text-sm text-gray-600 text-center mb-6">
                {errorMessage}
              </p>
              <button
                onClick={initializeCheckout}
                className="px-6 py-2 bg-[#7bc74d] text-white rounded-xl font-semibold hover:bg-[#6ab63d] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Success State */}
          {modalState === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-gray-900 font-semibold mb-2">
                {isTopup ? "Wallet Topped Up!" : `Welcome to ${planName}!`}
              </p>
              <p className="text-sm text-gray-600 text-center mb-6">
                {isTopup
                  ? "Your messaging credits have been added to your account."
                  : "Your subscription is now active. Enjoy all the premium features."}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#7bc74d] text-white rounded-xl font-semibold hover:bg-[#6ab63d] transition-colors"
              >
                {isTopup ? "Done" : "Get Started"}
              </button>
            </div>
          )}

          {/* Payment Form */}
          {modalState === "ready" && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: clientSecret,
                appearance: stripeElementsAppearance,
                loader: "auto",
              }}
            >
              <CheckoutForm
                amount={amount}
                currency={currency}
                returnUrl={returnUrl}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

