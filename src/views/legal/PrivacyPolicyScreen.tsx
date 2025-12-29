"use client";

import React from "react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function PrivacyPolicyScreen() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <AnimatedGridPattern
            width={60}
            height={60}
            numSquares={50}
            maxOpacity={0.1}
            duration={4}
          />
        </div>
        
        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-[#7bc74d]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <Navbar />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 sm:pt-20 sm:pb-20 md:pt-28 md:pb-28 lg:pt-32 lg:pb-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#7bc74d]/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 mb-6 sm:mb-8">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[#7bc74d]" />
                <span className="text-xs sm:text-sm font-semibold text-[#7bc74d]">Privacy & Security</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-gilroy-black text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight px-2">
                Privacy Policy
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
                Your privacy is our priority. Learn how we protect and handle your data.
              </p>
              <p className="text-sm sm:text-base text-gray-400 mt-4 px-2">
                Last updated: {currentDate}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-blue-200/50 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-500 flex items-center justify-center">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-gilroy-black text-gray-900 mb-3">
                      Introduction
                    </h2>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      At PointNow, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our platform and services.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg">
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                    Information We Collect
                  </h2>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-3 sm:mb-4">
                    1. Personal Information
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>Name, email address, and phone number</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>Business registration details (for business accounts)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>Payment information (processed securely through third-party providers)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-3 sm:mb-4">
                    2. Usage Data
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>Transaction history and loyalty point activities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>Device information and IP address</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>Browser type and version, operating system</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-3 sm:mb-4">
                    3. Customer Data (For Businesses)
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-3">
                    As a business using PointNow, you may upload customer information. This data:
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>Belongs exclusively to you and is encrypted on our servers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>Is never sold, shared, or used for third-party advertising</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>Can only be accessed by verified business owners</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Lock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                    How We Use Your Information
                  </h2>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200">
                <ul className="space-y-4 sm:space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#7bc74d] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">Service Delivery</h4>
                      <p className="text-gray-700 text-sm sm:text-base">To provide, maintain, and improve our loyalty platform and services</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#7bc74d] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">Communication</h4>
                      <p className="text-gray-700 text-sm sm:text-base">To send you important updates, notifications, and respond to your inquiries</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#7bc74d] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">Security</h4>
                      <p className="text-gray-700 text-sm sm:text-base">To detect, prevent, and address technical issues and security threats</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#7bc74d] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">Analytics</h4>
                      <p className="text-gray-700 text-sm sm:text-base">To analyze usage patterns and improve user experience (anonymized data only)</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-green-200/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#7bc74d] flex items-center justify-center">
                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4">
                      Data Security
                    </h2>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                      We implement industry-standard security measures to protect your data:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-700">End-to-end encryption</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-700">Secure server infrastructure</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-700">Regular security audits</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-700">Access controls and authentication</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                    Data Sharing and Disclosure
                  </h2>
                </div>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-red-100 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-3">
                      We Do NOT Sell Your Data
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                      PointNow does not sell, rent, or trade your personal information or customer data to third parties for marketing purposes.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-4">
                    Limited Sharing Scenarios
                  </h3>
                  <ul className="space-y-3 text-base sm:text-lg text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-[#7bc74d] font-bold">•</span>
                      <span><strong>Service Providers:</strong> We may share data with trusted third-party service providers (e.g., payment processors, hosting services) who assist in operating our platform, subject to strict confidentiality agreements.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#7bc74d] font-bold">•</span>
                      <span><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#7bc74d] font-bold">•</span>
                      <span><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale, your data may be transferred as part of the business assets, with prior notice to users.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-blue-200/50">
                <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-6 sm:mb-8">
                  Your Rights
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Access</h4>
                    <p className="text-sm sm:text-base text-gray-700">Request access to your personal data</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Correction</h4>
                    <p className="text-sm sm:text-base text-gray-700">Update or correct inaccurate information</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Deletion</h4>
                    <p className="text-sm sm:text-base text-gray-700">Request deletion of your data</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Export</h4>
                    <p className="text-sm sm:text-base text-gray-700">Export your data in a portable format</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                  Cookies and Tracking Technologies
                </h2>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and improve our services. You can control cookie preferences through your browser settings.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 mt-4">
                  <p className="text-sm sm:text-base text-gray-600">
                    <strong>Essential Cookies:</strong> Required for the platform to function properly (cannot be disabled)
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gradient-to-br from-[#7bc74d]/10 to-[#6ab63d]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-[#7bc74d]/20">
                <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                  Contact Us
                </h2>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                  If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
                </p>
                <div className="space-y-3">
                  <p className="text-base sm:text-lg text-gray-700">
                    <strong>Email:</strong> <a href="mailto:hello@pointnow.io" className="text-[#7bc74d] hover:underline">hello@pointnow.io</a>
                  </p>
                  <p className="text-base sm:text-lg text-gray-700">
                    <strong>Phone:</strong> <a href="tel:+601162464247" className="text-[#7bc74d] hover:underline">+60 11-6246 4247</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4">
                Policy Updates
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}






