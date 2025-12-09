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
  Sparkle
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
        
        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7bc74d]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7bc74d]/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <Navbar />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pt-32 md:pb-32">
            {/* Hero Content */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#7bc74d]/20 backdrop-blur-sm rounded-full px-5 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-[#7bc74d]" />
                <span className="text-sm font-semibold text-[#7bc74d]">Our Story</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-gilroy-black text-white leading-[1.1] mb-6 tracking-tight">
                The Birth of <span className="text-[#7bc74d]">PointNow</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Once upon a time, success meant owning a house, a car, or stocks. Today, those milestones feel distant. We asked: what if loyalty could be the new ownership?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 md:space-y-24">
            {/* The Idea */}
            <div className="relative">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-6">
                    The Idea
                  </h2>
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Originally called Poinfolio, PointNow started with a simple question: <strong className="text-gray-900">&quot;What if we could help people build a portfolio—not of stocks, but of loyalty points?&quot;</strong>
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      We wanted to let people earn, track, and use their loyalty across their favorite brands. From cafés to fashion, fitness to skincare—every ringgit you spend becomes a point of pride. You don&apos;t just spend, you build. You don&apos;t just buy, you belong.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Philosophy */}
            <div className="relative">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-8">
                    The Philosophy
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                      <h3 className="text-xl font-gilroy-black text-gray-900 mb-3">From Ads to Authentic Loyalty</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Brands don&apos;t need more promotions—they need relationships. Loyalty isn&apos;t a stamp card. It&apos;s a system of recognition.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                      <h3 className="text-xl font-gilroy-black text-gray-900 mb-3">From Customers to Stakeholders</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Your best customer isn&apos;t the one who walks in once. It&apos;s the one who comes back, again and again, and deserves to be seen.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8 border border-pink-200/50 hover:shadow-xl transition-all duration-300">
                      <h3 className="text-xl font-gilroy-black text-gray-900 mb-3">From Ownership to Meaningful Experience</h3>
                      <p className="text-gray-700 leading-relaxed">
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
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-8">
                  Loyalty Is the New Asset Class
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-gilroy-black text-gray-900 mb-3">Consumers</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Build your &quot;point wealth&quot; across multiple brands
                    </p>
                  </div>
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                    <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-gilroy-black text-gray-900 mb-3">Businesses</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Identify and reward your top supporters
                    </p>
                  </div>
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                    <div className="w-14 h-14 bg-[#7bc74d] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Sparkle className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-gilroy-black text-gray-900 mb-3">Communities</h3>
                    <p className="text-gray-600 leading-relaxed">
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
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center shadow-lg">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-gilroy-black text-gray-900 mb-6">
                  What&apos;s Next?
                </h2>
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    In this new economy, attention is currency, and loyalty is leverage. PointNow is on a mission to help 10,000 brands across Southeast Asia activate viral word-of-mouth through leaderboard rewards, build deeper relationships with their top spenders, and turn everyday customers into brand champions.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    And help millions of consumers discover local gems, compete for exclusive rewards, and build their own lifestyle &quot;Poinfolio.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width Dark */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#7bc74d]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7bc74d]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
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
          <div className="inline-flex items-center gap-2 bg-[#7bc74d]/20 backdrop-blur-sm rounded-full px-5 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-[#7bc74d]" />
            <span className="text-sm font-semibold text-[#7bc74d]">Join the Movement</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-gilroy-black mb-6 leading-tight">
            Ready to Transform Your 
            <span className="text-[#7bc74d]"> Business</span>?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            If you&apos;re a customer — start earning.
            <br />
            If you&apos;re a brand — start rewarding.
            <br />
            If you&apos;re a visionary — let&apos;s talk.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link href="/auth?mode=user">
              <button className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white px-10 py-5 rounded-2xl font-semibold text-xl transition-all shadow-2xl hover:shadow-[#7bc74d]/25 hover:scale-105 w-full sm:w-auto inline-flex items-center gap-3">
                Start Earning Points
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/auth?mode=business">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-semibold text-xl transition-all border border-white/20 hover:border-white/40 w-full sm:w-auto">
                Start Rewarding
              </button>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm">
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



