"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Loader2,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Receipt,
  Download,
  ExternalLink,
  FileText,
  MessageSquare,
  Wallet,
  Plus,
  Minus,
} from "lucide-react";
import { subscriptionApi } from "@/lib/api/subscription";
import { paymentApi } from "@/lib/api/payment";
import { useAuthStore } from "@/lib/auth/store";
import { CheckoutModal, BillingPortalButton } from "@/components/stripe";
import type {
  SubscriptionProduct,
  Subscription,
  SubscriptionType,
} from "@/lib/types/subscription";
import type { Invoice } from "@/lib/types/payment";

interface BillingProps {
  restaurantName?: string;
}

// Topup amount options for messaging credits
const TOPUP_OPTIONS = [
  { credits: 100, amount: 10, label: "100 SMS" },
  { credits: 500, amount: 45, label: "500 SMS" },
  { credits: 1000, amount: 80, label: "1,000 SMS" },
  { credits: 5000, amount: 350, label: "5,000 SMS" },
];

export default function Billing({ restaurantName }: BillingProps) {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();

  // State for subscription data
  const [subscriptionProducts, setSubscriptionProducts] = useState<
    SubscriptionProduct[]
  >([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [_activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [subscriptionType, setSubscriptionType] =
    useState<SubscriptionType | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  // State for invoices
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  // State for wallet topup
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState(TOPUP_OPTIONS[1].amount);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [showTopupSuccess, setShowTopupSuccess] = useState(false);

  const businessId = user?.businessId || "";
  const businessName = restaurantName || user?.businessName || "";

  // Easy to manipulate - set to true for dev/sandbox, false for production
  const IS_TRIAL = process.env.NEXT_PUBLIC_IS_TRIAL === "true";

  // Check for payment completion from return URL
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const paymentType = searchParams.get("type");
    
    if (paymentStatus === "complete") {
      if (paymentType === "topup") {
        setShowTopupSuccess(true);
      }
      // Clear the URL parameter
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
      // Refresh data
      fetchInvoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (showTopupSuccess) {
      const timer = setTimeout(() => {
        setShowTopupSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTopupSuccess]);

  const fetchSubscriptionProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const response = await subscriptionApi.getProducts({
        page: 1,
        limit: 10,
        is_trial: IS_TRIAL,
      });
      setSubscriptionProducts(response.data.subscription_products || []);
    } catch (err) {
      console.error("Failed to load subscription products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [IS_TRIAL]);

  const fetchActiveSubscription = useCallback(async () => {
    if (!businessId) return;

    setIsLoadingSubscription(true);
    try {
      const response = await subscriptionApi.getActiveByBusinessId({
        provider_name: "STRIPE",
        business_id: businessId,
      });
      setActiveSubscription(response.data.subscription);

      // If we have an active subscription, fetch the subscription type
      if (response.data.subscription?.subscription_type_id) {
        const typeResponse = await subscriptionApi.getTypeById(
          response.data.subscription.subscription_type_id
        );
        setSubscriptionType(typeResponse.data.subscription_type);
      }
    } catch (err) {
      console.error("Failed to load active subscription:", err);
    } finally {
      setIsLoadingSubscription(false);
    }
  }, [businessId]);

  const fetchInvoices = useCallback(async () => {
    if (!businessId) return;

    setIsLoadingInvoices(true);
    try {
      const response = await paymentApi.getInvoices(businessId);
      setInvoices(response.data?.invoices?.data || []);
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setIsLoadingInvoices(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (!businessId) {
      return;
    }

    fetchSubscriptionProducts();
    fetchActiveSubscription();
    fetchInvoices();
  }, [businessId, fetchSubscriptionProducts, fetchActiveSubscription, fetchInvoices]);

  // Original subscription upgrade handler - opens external link
  const handleUpgrade = (link: string) => {
    const url = new URL(link);
    url.searchParams.set("client_reference_id", businessId);
    window.open(url.toString(), "_blank");
  };

  // Topup wallet handlers
  const handleSelectPresetAmount = (amount: number) => {
    setTopupAmount(amount);
    setIsCustomAmount(false);
  };

  const handleCustomAmountChange = (value: number) => {
    setTopupAmount(value);
    setIsCustomAmount(true);
  };

  const handleTopupClick = () => {
    setIsTopupModalOpen(true);
  };

  const handleTopupClose = () => {
    setIsTopupModalOpen(false);
  };

  const handleTopupSuccess = () => {
    setIsTopupModalOpen(false);
    setShowTopupSuccess(true);
    fetchInvoices();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const convertToUSD = (myrPrice: number) => {
    return Math.round(myrPrice / 4.11);
  };

  // Format currency for invoices (amount is in cents)
  const formatInvoiceAmount = (amount: number, currency: string) => {
    const currencyUpper = currency.toUpperCase();
    const amountInUnits = amount / 100;
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: currencyUpper,
      minimumFractionDigits: 2,
    }).format(amountInUnits);
  };

  // Format date from Unix timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "open":
        return "bg-yellow-100 text-yellow-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "void":
        return "bg-red-100 text-red-700";
      case "uncollectible":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get monthly product for subscription (price is in MYR)
  const monthlyProduct = subscriptionProducts.find(
    (p) => p.duration === "MONTHLY"
  );

  // Display price from API (in MYR)
  const displayPriceMYR = monthlyProduct?.price || null;

  // Determine current plan
  const currentPlanName = subscriptionType?.name?.toUpperCase() || "FREE";
  const isOnFreePlan = currentPlanName === "FREE";
  const isOnProfessionalPlan =
    currentPlanName === "PROFESSIONAL" || currentPlanName === "PRO";

  // Badge logic
  const getBasicBadge = () => {
    if (isOnFreePlan) return "Current Plan";
    return "Starter";
  };

  const getProfessionalBadge = () => {
    if (isOnProfessionalPlan) return "Current Plan";
    return "Most Popular";
  };

  const isLoadingPlan = isLoadingProducts || isLoadingSubscription;

  // Feature lists
  const basicFeatures = [
    "Up to 3,000 customers",
    "Points system",
    "Customer leaderboard",
    "Mobile-friendly dashboard",
    "Email support",
    "Basic analytics",
    "QR code generation",
    "Single store location",
  ];

  const professionalFeatures = [
    "Unlimited customers",
    "Advanced points system",
    "Customer leaderboard with insights",
    "Mobile-friendly dashboard",
    "Priority email support",
    "Advanced analytics & reports",
    "QR code generation",
    "Multiple store locations",
    "Custom branding & logo",
    "SMS notifications",
    "Referral program tools",
    "Export customer data",
    "Custom point rules",
    "Customer message blasting (pay per use)",
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Topup Success Banner */}
        {showTopupSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-900">
                Wallet Topped Up Successfully!
              </p>
              <p className="text-sm text-green-700">
                Your messaging credits have been added to your account.
              </p>
            </div>
            <button
              onClick={() => setShowTopupSuccess(false)}
              className="text-green-500 hover:text-green-700 p-1"
            >
              ×
            </button>
          </div>
        )}

        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-gilroy-black text-black mb-2">
              Billing
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your subscription and messaging credits
            </p>
          </div>

          {/* Billing Portal Button - Only show for paid users */}
          {isOnProfessionalPlan && businessId && (
            <BillingPortalButton
              businessId={businessId}
              variant="outline"
              size="md"
            />
          )}
        </div>

        {/* Subscription Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 border-2 border-gray-200 overflow-hidden">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-gilroy-black text-black">
              Subscription
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage your plan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Basic Plan - Free */}
            <div
              className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${
                isOnFreePlan
                  ? "border-4 border-gray-400"
                  : "border-2 border-gray-200 hover:border-gray-400"
              }`}
            >
              {/* Badge */}
              <div
                className={`absolute top-0 right-0 ${
                  getBasicBadge() === "Current Plan"
                    ? "bg-gray-600"
                    : "bg-gray-500"
                } text-white text-xs font-semibold px-4 py-2 rounded-bl-xl`}
              >
                {isLoadingPlan ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  getBasicBadge()
                )}
              </div>

              <div className="p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-gray-600" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-gilroy-black text-black mb-2">
                  Basic
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Perfect for small businesses getting started with loyalty
                  programs
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-gilroy-black text-black">
                      Free
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Included with your account
                  </p>
                </div>

                {/* CTA Button */}
                {isOnFreePlan ? (
                  <div className="w-full py-3 rounded-xl font-semibold mb-6 text-center bg-gray-100 text-gray-500">
                    Current Plan
                  </div>
                ) : (
                  <div className="w-full py-3 rounded-xl font-semibold mb-6 text-center bg-gray-100 text-gray-400">
                    Included
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3">
                  {basicFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Professional Plan - From API */}
            <div
              className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${
                isOnProfessionalPlan
                  ? "border-4 border-[#7bc74d]"
                  : "border-4 border-[#7bc74d] transform md:scale-105 z-10"
              }`}
            >
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-[#7bc74d] text-white text-xs font-semibold px-4 py-2 rounded-bl-xl">
                {isLoadingPlan ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  getProfessionalBadge()
                )}
              </div>

              <div className="p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-[#7bc74d]" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-gilroy-black text-black mb-2">
                  Professional
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  For growing businesses ready to unlock unlimited potential
                </p>

                {/* Price */}
                <div className="mb-6">
                  {isLoadingProducts ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-black" />
                    </div>
                  ) : displayPriceMYR !== null ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-gilroy-black text-black">
                          ${formatPrice(convertToUSD(displayPriceMYR))}
                        </span>
                        <span className="text-gray-600">/month</span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-gilroy-black text-gray-700">
                          RM{formatPrice(displayPriceMYR)}
                        </span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-gilroy-black text-black">
                        -
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  )}
                </div>

                {/* CTA Button - Original external link implementation */}
                {isOnProfessionalPlan ? (
                  <div className="w-full py-3 rounded-xl font-semibold mb-6 text-center bg-gray-100 text-gray-500">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => monthlyProduct && handleUpgrade(monthlyProduct.link)}
                    disabled={!monthlyProduct || isLoadingProducts}
                    className={`w-full py-3 rounded-xl font-semibold transition-colors mb-6 ${
                      monthlyProduct && !isLoadingProducts
                        ? "bg-[#7bc74d] hover:bg-[#6ab63d] text-white shadow-lg shadow-[#7bc74d]/25"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Upgrade Now
                  </button>
                )}

                {/* Features */}
                <div className="space-y-3">
                  {professionalFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topup Wallet Section - Uses Stripe SDK */}
        <div className="mt-8 bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 border-2 border-gray-200">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-gilroy-black text-black flex items-center gap-3">
                <Wallet className="w-7 h-7 text-[#7bc74d]" />
                Messaging Wallet
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Top up credits to send SMS messages to your customers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wallet Info Card */}
            <div className="lg:col-span-1 bg-gradient-to-br from-[#7bc74d] to-[#5da336] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">SMS Credits</p>
                  <p className="text-2xl font-gilroy-black">Coming Soon</p>
                </div>
              </div>
              <p className="text-white/70 text-sm">
                Use credits to blast promotional messages, OTP verification, and updates to your customers.
              </p>
            </div>

            {/* Topup Options */}
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold text-gray-700 mb-4">Select top-up amount</p>
              
              {/* Preset Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {TOPUP_OPTIONS.map((option) => {
                  const isSelected = topupAmount === option.amount && !isCustomAmount;
                  return (
                    <button
                      key={option.amount}
                      type="button"
                      onClick={() => handleSelectPresetAmount(option.amount)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? "border-[#7bc74d] bg-[#7bc74d]/10"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <p className={`text-lg font-bold ${isSelected ? "text-[#7bc74d]" : "text-gray-900"}`}>
                        RM{option.amount}
                      </p>
                      <p className="text-xs text-gray-500">{option.label}</p>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Or enter custom amount (RM)</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (topupAmount > 2) {
                        handleCustomAmountChange(Math.max(2, topupAmount - 10));
                      }
                    }}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <input
                    type="number"
                    min="2"
                    step="1"
                    placeholder="Custom"
                    value={isCustomAmount ? topupAmount : ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 2) {
                        handleCustomAmountChange(value);
                      } else if (e.target.value === "") {
                        handleCustomAmountChange(2);
                      }
                    }}
                    onFocus={() => {
                      if (!isCustomAmount) {
                        setIsCustomAmount(true);
                      }
                    }}
                    className={`flex-1 px-4 py-2 border-2 rounded-xl focus:outline-none text-center font-bold text-gray-900 transition-colors ${
                      isCustomAmount
                        ? "border-[#7bc74d] bg-white"
                        : "border-gray-200 bg-white focus:border-[#7bc74d]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleCustomAmountChange(topupAmount + 10);
                    }}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Topup Button */}
              <button
                type="button"
                onClick={handleTopupClick}
                disabled={topupAmount < 2}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  topupAmount >= 2
                    ? "bg-[#7bc74d] hover:bg-[#6ab63d] text-white shadow-lg shadow-[#7bc74d]/25"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Wallet className="w-5 h-5" />
                Top Up RM{topupAmount}
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Section */}
        <div className="mt-8 bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 border-2 border-gray-200">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-gilroy-black text-black flex items-center gap-3">
                <Receipt className="w-7 h-7 text-gray-600" />
                Invoices
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View and download your payment history
              </p>
            </div>
          </div>

          {/* Invoices List */}
          {isLoadingInvoices ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No invoices yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Your invoices will appear here after your first payment
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="w-full hidden sm:table">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Invoice
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {invoice.number}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {invoice.lines?.data?.[0]?.description ||
                              "Payment"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(invoice.created)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          {formatInvoiceAmount(invoice.total, invoice.currency)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {invoice.hosted_invoice_url && (
                            <a
                              href={invoice.hosted_invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Invoice"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {invoice.invoice_pdf && (
                            <a
                              href={invoice.invoice_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-500 hover:text-[#7bc74d] hover:bg-green-50 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="bg-gray-50 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {invoice.number}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {invoice.lines?.data?.[0]?.description ||
                            "Payment"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">
                          {formatDate(invoice.created)}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatInvoiceAmount(invoice.total, invoice.currency)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {invoice.hosted_invoice_url && (
                          <a
                            href={invoice.hosted_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                            title="View Invoice"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {invoice.invoice_pdf && (
                          <a
                            href={invoice.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-[#7bc74d] hover:bg-white rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stripe Checkout Modal - For Wallet Topup Only */}
      <CheckoutModal
        isOpen={isTopupModalOpen}
        onClose={handleTopupClose}
        businessId={businessId}
        businessName={businessName}
        amount={topupAmount}
        currency="MYR"
        planName="Messaging Credits"
        onPaymentSuccess={handleTopupSuccess}
      />
    </div>
  );
}
