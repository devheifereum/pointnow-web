"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, TrendingUp, Star, Crown } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";

export default function PricingScreen() {

  const plans = [
    {
      name: "Professional",
      price: 73,
      priceMYR: 300,
      badge: "Most Popular",
      icon: TrendingUp,
      iconColor: "text-[#7bc74d]",
      description: "For growing businesses ready to scale their loyalty programs",
      features: [
        { text: "Unlimited customers", included: true },
        { text: "Basic points system", included: true },
        { text: "Customer leaderboard", included: true },
        { text: "Mobile-friendly dashboard", included: true },
        { text: "Email support", included: true },
        { text: "Basic analytics", included: true },
        { text: "QR code generation", included: true },
        { text: "Advanced analytics & insights", included: true },
        { text: "Custom branding & logo", included: true },
        { text: "Multiple store locations", included: true },
        { text: "SMS notifications", included: true },
        { text: "Referral program tools", included: true },
        { text: "Export customer data", included: true },
        { text: "Priority email support", included: true },
        { text: "Custom point rules", included: true },
      ],
      cta: "Get Started",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: null,
      priceMYR: null,
      badge: "Premium",
      icon: Crown,
      iconColor: "text-purple-500",
      description: "For large businesses with advanced needs and multiple locations",
      features: [
        { text: "Everything in Professional", included: true },
        { text: "Full API access", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Custom integrations", included: true },
        { text: "White-label solution", included: true },
        { text: "Advanced security features", included: true },
        { text: "24/7 phone support", included: true },
        { text: "Custom point tiers", included: true },
        { text: "Multi-language support", included: true },
        { text: "Onboarding & training", included: true },
        { text: "SLA guarantee", included: true },
      ],
      cta: "Contact Us",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Absolutely! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately and we'll prorate any charges accordingly.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and bank transfers for Enterprise plans. All payments are processed securely through Stripe.",
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "We'll notify you before you reach any limits and help you upgrade smoothly without any service interruption.",
    },
    {
      question: "How do I contact you for Enterprise pricing?",
      answer: "Please reach out to our sales team through the contact form or email us directly. We'll work with you to create a custom plan that fits your business needs.",
    },
  ];


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
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const displayPrice = plan.price || null;
              const displayPriceMYR = plan.priceMYR || null;
              
              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${
                    plan.highlighted
                      ? "border-4 border-[#7bc74d] transform md:scale-105 z-10"
                      : "border-2 border-gray-200 hover:border-[#7bc74d]"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className={`absolute top-0 right-0 ${
                      plan.highlighted ? "bg-[#7bc74d]" : "bg-gray-900"
                    } text-white text-xs font-semibold px-4 py-2 rounded-bl-xl`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${plan.iconColor}`} />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-gilroy-black text-black mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      {displayPrice !== null ? (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-gilroy-black text-black">
                              ${displayPrice}
                            </span>
                            <span className="text-gray-600">
                              /month
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-2xl font-gilroy-black text-gray-700">
                              RM{displayPriceMYR}
                            </span>
                            <span className="text-gray-500 text-sm">
                              /month
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="mb-6">
                          <span className="text-3xl font-gilroy-black text-black">
                            Contact Us
                          </span>
                          <p className="text-gray-600 text-sm mt-2">
                            Custom pricing for your business needs
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={plan.name === "Enterprise" ? "/auth?mode=business&plan=enterprise" : "/auth?mode=business"}
                      className={`w-full py-3 rounded-xl font-semibold transition-colors mb-6 inline-block text-center ${
                        plan.highlighted
                          ? "bg-[#7bc74d] hover:bg-[#6ab63d] text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                    >
                      {plan.cta}
                    </Link>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
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
                <Link
                  href="/auth?mode=business"
                  className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white px-8 py-4 rounded-xl font-semibold transition-colors inline-block text-center"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth?mode=business"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-colors border border-white/20 inline-block text-center"
                >
                  Schedule Demo
                </Link>
              </div>
              <p className="text-sm opacity-75 mt-6">
                Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


