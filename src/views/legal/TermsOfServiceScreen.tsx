"use client";

import React from "react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Scale, AlertTriangle, CheckCircle2, Shield, Users } from "lucide-react";

export default function TermsOfServiceScreen() {
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
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <Navbar />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 sm:pt-20 sm:pb-20 md:pt-28 md:pb-28 lg:pt-32 lg:pb-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#7bc74d]/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 mb-6 sm:mb-8">
                <Scale className="w-3 h-3 sm:w-4 sm:h-4 text-[#7bc74d]" />
                <span className="text-xs sm:text-sm font-semibold text-[#7bc74d]">Legal Terms</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-gilroy-black text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight px-2">
                Terms of Service
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
                Please read these terms carefully before using PointNow services.
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
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-purple-200/50 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-500 flex items-center justify-center">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-gilroy-black text-gray-900 mb-3">
                      Agreement to Terms
                    </h2>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      By accessing or using PointNow&apos;s platform and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access or use our services.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Terms */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                    Account Terms
                  </h2>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-3 sm:mb-4">
                    Account Registration
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>You must provide accurate, current, and complete information during registration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>You are responsible for maintaining the confidentiality of your account credentials</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>You must be at least 18 years old or have parental consent to use our services</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7bc74d] flex-shrink-0 mt-0.5" />
                      <span>One person or entity may maintain only one account unless explicitly authorized</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-3 sm:mb-4">
                    Account Security
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-3">
                    You are responsible for:
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-gray-700">
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>All activities that occur under your account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>Notifying us immediately of any unauthorized access or security breaches</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>Using strong, unique passwords and enabling two-factor authentication when available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Service Usage */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                    Acceptable Use
                  </h2>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-red-200">
                <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  Prohibited Activities
                </h3>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                  You agree NOT to:
                </p>
                <ul className="space-y-3 text-base sm:text-lg text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Use the service for any illegal purpose or in violation of any laws</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Attempt to gain unauthorized access to any part of the platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Interfere with or disrupt the service or servers connected to the service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Upload malicious code, viruses, or harmful software</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Impersonate any person or entity or misrepresent your affiliation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Collect or harvest information about other users without consent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Use automated systems to access the service without authorization</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-green-200/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#7bc74d] flex items-center justify-center">
                    <Scale className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4">
                      Payment Terms
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Subscription Fees</h3>
                        <p className="text-sm sm:text-base text-gray-700">Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable unless required by law.</p>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Wallet Top-ups</h3>
                        <p className="text-sm sm:text-base text-gray-700">Credits purchased for messaging services are non-refundable but do not expire. Credits are consumed when messages are sent.</p>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Price Changes</h3>
                        <p className="text-sm sm:text-base text-gray-700">We reserve the right to modify pricing with 30 days&apos; notice. Existing subscriptions will continue at current rates until renewal.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                  Intellectual Property
                </h2>
                <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                  <p>
                    The PointNow platform, including its design, features, logos, and content, is protected by copyright, trademark, and other intellectual property laws. All rights are reserved.
                  </p>
                  <p>
                    <strong>Your Content:</strong> You retain ownership of all data and content you upload to PointNow. By using our services, you grant us a limited license to store, process, and display your content solely for the purpose of providing our services.
                  </p>
                  <p>
                    <strong>Our Content:</strong> You may not copy, modify, distribute, or create derivative works based on our platform without explicit written permission.
                  </p>
                </div>
              </div>
            </div>

            {/* Service Availability */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200">
                <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                  Service Availability
                </h2>
                <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                  <p>
                    We strive to provide reliable and continuous service, but we do not guarantee uninterrupted or error-free operation. The service may be temporarily unavailable due to:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Scheduled maintenance</li>
                    <li>System updates or upgrades</li>
                    <li>Technical issues or failures</li>
                    <li>Force majeure events</li>
                  </ul>
                  <p className="mt-4">
                    We will make reasonable efforts to notify users of planned maintenance and minimize service disruptions.
                  </p>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4">
                      Limitation of Liability
                    </h2>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                      To the maximum extent permitted by law:
                    </p>
                    <ul className="space-y-3 text-base sm:text-lg text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>PointNow shall not be liable for any indirect, incidental, special, or consequential damages</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>We are not responsible for data loss, though we implement industry-standard backup procedures</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Termination */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                  Termination
                </h2>
                <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                  <p>
                    <strong>By You:</strong> You may terminate your account at any time by contacting us or using account deletion features in your dashboard.
                  </p>
                  <p>
                    <strong>By Us:</strong> We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a security risk. We will provide notice when possible.
                  </p>
                  <p>
                    <strong>Effect of Termination:</strong> Upon termination, your access to the service will cease. You may export your data before termination. We may delete your data after a reasonable retention period.
                  </p>
                </div>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-indigo-200/50">
                <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4">
                  Governing Law
                </h2>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of Malaysia. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Malaysia.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gradient-to-br from-[#7bc74d]/10 to-[#6ab63d]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-[#7bc74d]/20">
                <h2 className="text-2xl sm:text-3xl font-gilroy-black text-gray-900 mb-4 sm:mb-6">
                  Questions About These Terms?
                </h2>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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
                Changes to Terms
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Material changes will be communicated via email or platform notification. Your continued use of our services after changes become effective constitutes acceptance of the updated terms.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}



