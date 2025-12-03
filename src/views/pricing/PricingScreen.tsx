"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import { subscriptionApi } from "@/lib/api/subscription";
import { useAuthStore } from "@/lib/auth/store";
import type { SubscriptionProduct, Subscription, SubscriptionType } from "@/lib/types/subscription";

export default function PricingScreen() {
  const { user, isAuthenticated } = useAuthStore();
  const [subscriptionProducts, setSubscriptionProducts] = useState<SubscriptionProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  const businessId = user?.businessId || "";

  // Easy to manipulate - set to true for dev/sandbox, false for production
  const IS_TRIAL = process.env.NEXT_PUBLIC_IS_TRIAL === "true";

  useEffect(() => {
    fetchSubscriptionProducts();
    if (isAuthenticated && businessId) {
      fetchActiveSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, businessId]);

  const fetchSubscriptionProducts = async () => {
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
  };

  const fetchActiveSubscription = async () => {
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
  };

  const handleUpgrade = (link: string) => {
    if (!isAuthenticated || !businessId) {
      // Redirect to auth if not authenticated
      window.location.href = "/auth?mode=business";
      return;
    }
    const url = new URL(link);
    url.searchParams.set("client_reference_id", businessId);
    window.open(url.toString(), "_blank");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const convertToUSD = (myrPrice: number) => {
    return Math.round(myrPrice / 4.11);
  };

  // Get monthly product for subscription (price is in MYR)
  const monthlyProduct = subscriptionProducts.find(p => p.duration === "MONTHLY");
  
  // Display price from API (in MYR)
  const displayPriceMYR = monthlyProduct?.price || null;

  // Determine current plan
  const currentPlanName = subscriptionType?.name?.toUpperCase() || "FREE";
  const isOnFreePlan = currentPlanName === "FREE";
  const isOnProfessionalPlan = currentPlanName === "PROFESSIONAL" || currentPlanName === "PRO";

  // Badge logic
  const getBasicBadge = () => {
    if (!isAuthenticated) return "Starter";
    if (isOnFreePlan && activeSubscription) return "Current Plan";
    if (isOnFreePlan && !activeSubscription) return "Current Plan"; // Default for logged in users
    return "Starter";
  };

  const getProfessionalBadge = () => {
    if (isOnProfessionalPlan) return "Current Plan";
    return "Most Popular";
  };

  const basicFeatures = [
    { text: "Up to 3,000 customers", included: true },
    { text: "Points system", included: true },
    { text: "Customer leaderboard", included: true },
    { text: "Mobile-friendly dashboard", included: true },
    { text: "Email support", included: true },
    { text: "Basic analytics", included: true },
    { text: "QR code generation", included: true },
    { text: "Single store location", included: true },
  ];

  const professionalFeatures = [
    { text: "Unlimited customers", included: true },
    { text: "Advanced points system", included: true },
    { text: "Customer leaderboard with insights", included: true },
    { text: "Mobile-friendly dashboard", included: true },
    { text: "Priority email support", included: true },
    { text: "Advanced analytics & reports", included: true },
    { text: "QR code generation", included: true },
    { text: "Multiple store locations", included: true },
    { text: "Custom branding & logo", included: true },
    { text: "SMS notifications", included: true },
    { text: "Referral program tools", included: true },
    { text: "Export customer data", included: true },
    { text: "Custom point rules", included: true },
    { text: "Customer message blasting (pay per use)", included: true },
  ];

  const faqs = [
    {
      question: "Can I upgrade my plan anytime?",
      answer: "Absolutely! You can upgrade your plan at any time. Changes take effect immediately and we'll prorate any charges accordingly.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express). All payments are processed securely through Stripe.",
    },
    {
      question: "What happens if I exceed the 3,000 customer limit on Basic?",
      answer: "We'll notify you before you reach the limit and help you upgrade to Professional smoothly without any service interruption.",
    },
    {
      question: "How does customer message blasting work?",
      answer: "Customer message blasting is available for Professional users on a pay-per-use basis. You only pay for the messages you send.",
    },
  ];

  const isLoading = isLoadingProducts || isLoadingSubscription;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Effects */}
      <FlickeringGrid
        className="absolute inset-0 opacity-10"
        squareSize={6}
        gridGap={8}
        flickerChance={0.05}
        color="#7bc74d"
        maxOpacity={0.2}
      />
      
      <AnimatedGridPattern
        className="opacity-20"
        width={60}
        height={60}
        numSquares={50}
        maxOpacity={0.05}
        duration={4}
      />

      <div className="relative z-10">
        {/* Navigation */}
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-gilroy-black text-black mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your business.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16 max-w-5xl mx-auto">
            {/* Basic Plan - Free */}
            <div className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${
              isOnFreePlan && isAuthenticated
                ? "border-4 border-gray-400"
                : "border-2 border-gray-200 hover:border-gray-400"
            }`}>
              {/* Badge */}
              <div className={`absolute top-0 right-0 ${
                getBasicBadge() === "Current Plan" ? "bg-gray-600" : "bg-gray-500"
              } text-white text-xs font-semibold px-4 py-2 rounded-bl-xl`}>
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : getBasicBadge()}
              </div>

              <div className="p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-gray-600" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-gilroy-black text-black mb-2">Basic</h3>
                <p className="text-gray-600 text-sm mb-6">Perfect for small businesses getting started with loyalty programs</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-gilroy-black text-black">
                      Free
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    No credit card required
                  </p>
                </div>

                {/* CTA Button */}
                {isAuthenticated && isOnFreePlan ? (
                  <div className="w-full py-3 rounded-xl font-semibold mb-6 text-center bg-gray-100 text-gray-500">
                    Current Plan
                  </div>
                ) : !isAuthenticated ? (
                  <Link
                    href="/auth?mode=business"
                    className="w-full py-3 rounded-xl font-semibold transition-colors mb-6 inline-block text-center bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    Get Started Free
                  </Link>
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
                      <span className="text-sm text-gray-700">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Professional Plan - From API */}
            <div className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${
              isOnProfessionalPlan
                ? "border-4 border-[#7bc74d]"
                : "border-4 border-[#7bc74d] transform md:scale-105 z-10"
            }`}>
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-[#7bc74d] text-white text-xs font-semibold px-4 py-2 rounded-bl-xl">
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : getProfessionalBadge()}
              </div>

              <div className="p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-[#7bc74d]" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-gilroy-black text-black mb-2">Professional</h3>
                <p className="text-gray-600 text-sm mb-6">For growing businesses ready to unlock unlimited potential</p>

                {/* Price */}
                <div className="mb-6">
                  {isLoadingProducts && isAuthenticated ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-black" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-gilroy-black text-black">
                          ${displayPriceMYR !== null ? formatPrice(convertToUSD(displayPriceMYR)) : "73"}
                        </span>
                        <span className="text-gray-600">
                          /month
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-gilroy-black text-gray-700">
                          RM{displayPriceMYR !== null ? formatPrice(displayPriceMYR) : "300"}
                        </span>
                        <span className="text-gray-500 text-sm">
                          /month
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                {isOnProfessionalPlan ? (
                  <div className="w-full py-3 rounded-xl font-semibold mb-6 text-center bg-gray-100 text-gray-500">
                    Current Plan
                  </div>
                ) : isAuthenticated && businessId ? (
                  <button
                    onClick={() => monthlyProduct && handleUpgrade(monthlyProduct.link)}
                    disabled={!monthlyProduct || isLoadingProducts}
                    className={`w-full py-3 rounded-xl font-semibold transition-colors mb-6 ${
                      monthlyProduct && !isLoadingProducts
                        ? "bg-[#7bc74d] hover:bg-[#6ab63d] text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Upgrade Now
                  </button>
                ) : (
                  <Link
                    href="/auth?mode=business"
                    className="w-full py-3 rounded-xl font-semibold transition-colors mb-6 inline-block text-center bg-[#7bc74d] hover:bg-[#6ab63d] text-white"
                  >
                    Get Started
                  </Link>
                )}

                {/* Features */}
                <div className="space-y-3">
                  {professionalFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-4xl font-gilroy-black text-black text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-gilroy-extrabold text-black mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black mb-3 sm:mb-4">
                Ready to Grow Your Business?
              </h2>
              <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8">
                Join hundreds of merchants using PointNow to build customer loyalty and increase sales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated && businessId ? (
                  isOnProfessionalPlan ? (
                    <div className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold inline-block text-center">
                      You&apos;re on Professional! 🎉
                    </div>
                  ) : (
                    <button
                      onClick={() => monthlyProduct && handleUpgrade(monthlyProduct.link)}
                      disabled={!monthlyProduct || isLoadingProducts}
                      className={`px-8 py-4 rounded-xl font-semibold transition-colors inline-block text-center ${
                        monthlyProduct && !isLoadingProducts
                          ? "bg-[#7bc74d] hover:bg-[#6ab63d] text-white"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {isLoadingProducts ? "Loading..." : "Upgrade to Professional"}
                    </button>
                  )
                ) : (
                  <Link
                    href="/auth?mode=business"
                    className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white px-8 py-4 rounded-xl font-semibold transition-colors inline-block text-center"
                  >
                    Get Started Free
                  </Link>
                )}
                <Link
                  href="/auth?mode=business"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-colors border border-white/20 inline-block text-center"
                >
                  Schedule Demo
                </Link>
              </div>
              <p className="text-sm opacity-75 mt-6">
                Start free, upgrade anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
