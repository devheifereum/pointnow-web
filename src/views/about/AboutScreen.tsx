"use client";

import React from "react";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  Users, 
  TrendingUp, 
  Target, 
  Heart,
  ArrowRight,
  Sparkle,
  Shield
} from "lucide-react";

export default function AboutScreen() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark background */}
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
        
        {/* Decorative Shapes - Responsive sizing */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-[#7bc74d]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-[#7bc74d]/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <Navbar />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40">
            {/* Hero Content */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#7bc74d]/20 backdrop-blur-sm rounded-full px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 mb-8 sm:mb-10 md:mb-12">
                <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#7bc74d]" />
                <span className="text-sm sm:text-sm md:text-base font-semibold text-[#7bc74d]">Our Story</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-gilroy-black text-white leading-[1.1] mb-6 sm:mb-8 md:mb-10 tracking-tight">
                The Birth of <span className="text-[#7bc74d]">PointNow</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Once upon a time, success meant owning a house, a car, or stocks. Today, those milestones feel distant. We asked: what if loyalty could be the new ownership?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
            {/* The Idea */}
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 w-full">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
                    The Idea
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      Originally called Poinfolio, PointNow started with a simple question: <strong className="text-gray-900">&quot;What if we could help people build a portfolio—not of stocks, but of loyalty points?&quot;</strong>
                    </p>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      We wanted to let people earn, track, and use their loyalty across their favorite brands. From cafés to fashion, fitness to skincare—every ringgit you spend becomes a point of pride. You don&apos;t just spend, you build. You don&apos;t just buy, you belong.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Philosophy */}
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 w-full">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-6 sm:mb-8 text-center sm:text-left">
                    The Philosophy
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                      <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-2 sm:mb-3">From Ads to Authentic Loyalty</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Brands don&apos;t need more promotions—they need relationships. Loyalty isn&apos;t a stamp card. It&apos;s a system of recognition.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                      <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-2 sm:mb-3">From Customers to Stakeholders</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Your best customer isn&apos;t the one who walks in once. It&apos;s the one who comes back, again and again, and deserves to be seen.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-pink-200/50 hover:shadow-xl transition-all duration-300">
                      <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-2 sm:mb-3">From Ownership to Meaningful Experience</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        People want to feel something. They want to be part of something. Loyalty points, earned through real-life spending, become social currency.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div className="flex-1 w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-6 sm:mb-8 text-center sm:text-left">
                  Loyalty Is the New Asset Class
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
                      <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">Consumers</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center sm:text-left">
                      Build your &quot;point wealth&quot; across multiple brands
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
                      <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">Businesses</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center sm:text-left">
                      Identify and reward your top supporters
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group sm:col-span-2 lg:col-span-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#7bc74d] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
                      <Sparkle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-gilroy-black text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">Communities</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center sm:text-left">
                      Form around brand loyalty, not just transactions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div className="flex-1 w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
                  What&apos;s Next?
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    In this new economy, attention is currency, and loyalty is leverage. PointNow is on a mission to help 10,000 brands across Southeast Asia activate viral word-of-mouth through leaderboard rewards, build deeper relationships with their top spenders, and turn everyday customers into brand champions.
                  </p>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    And help millions of consumers discover local gems, compete for exclusive rewards, and build their own lifestyle &quot;Poinfolio.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div className="flex-1 w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
                  🔐 Your Customer Data Is Safe With Us
                </h2>
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-200">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    At PointNow, we take data privacy and security seriously. All customer data is encrypted and securely stored on protected servers, following industry best practices and security standards. We do not sell, share, or use your data for third-party advertising — your customer data belongs to you, and only you. Access is fully controlled, and only verified business owners can view or export their own customer list. Our system is built with multiple layers of security to minimize risks and ensure peace of mind for every merchant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width Dark */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background Elements - Responsive sizing */}
        <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-[#7bc74d]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-[#7bc74d]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 opacity-5">
          <AnimatedGridPattern
            width={60}
            height={60}
            numSquares={30}
            maxOpacity={0.1}
            duration={4}
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#7bc74d]/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 mb-6 sm:mb-8">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#7bc74d]" />
            <span className="text-xs sm:text-sm font-semibold text-[#7bc74d]">Join the Movement</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-gilroy-black mb-4 sm:mb-6 leading-tight px-2">
            Ready to Transform Your 
            <span className="text-[#7bc74d]"> Business</span>?
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
            If you&apos;re a customer — start earning.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            If you&apos;re a brand — start rewarding.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            If you&apos;re a visionary — let&apos;s talk.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6 sm:mb-8 px-2">
            <Link href="/auth?mode=user" className="w-full sm:w-auto">
              <button className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg md:text-xl transition-all shadow-2xl hover:shadow-[#7bc74d]/25 hover:scale-105 w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3">
                Start Earning Points
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </Link>
            <Link href="/auth?mode=business" className="w-full sm:w-auto">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg md:text-xl transition-all border border-white/20 hover:border-white/40 w-full sm:w-auto">
                Start Rewarding
              </button>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="pt-6 sm:pt-8 border-t border-white/10 px-2">
            <p className="text-xs sm:text-sm text-gray-400">
              PointNow — Because loyalty is worth more than ever.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
