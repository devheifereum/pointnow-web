"use client";

import React from "react";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Effects */}
      <FlickeringGrid
        className="absolute inset-0 opacity-5"
        squareSize={6}
        gridGap={8}
        flickerChance={0.03}
        color="#7bc74d"
        maxOpacity={0.1}
      />
      
      <AnimatedGridPattern
        className="opacity-10"
        width={60}
        height={60}
        numSquares={50}
        maxOpacity={0.03}
        duration={4}
      />

      <div className="relative z-10">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7bc74d]/10 to-[#6ab63d]/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#7bc74d]" />
              <span className="text-sm font-semibold text-[#7bc74d]">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-gilroy-black text-black mb-6 leading-tight">
              The Birth of PointNow
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Once upon a time, success meant owning a house, a car, or stocks. Today, those milestones feel distant. We asked: what if loyalty could be the new ownership?
            </p>
          </div>

          {/* Main Story */}
          <div className="space-y-16 md:space-y-24 mb-20">
            {/* The Idea */}
            <section className="relative">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-gilroy-black text-black mb-4">
                    The Idea
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Originally called Poinfolio, PointNow started with a simple question: <strong>&quot;What if we could help people build a portfolio—not of stocks, but of loyalty points?&quot;</strong>
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We wanted to let people earn, track, and use their loyalty across their favorite brands. From cafés to fashion, fitness to skincare—every ringgit you spend becomes a point of pride. You don&apos;t just spend, you build. You don&apos;t just buy, you belong.
                  </p>
                </div>
              </div>
            </section>

            {/* The Philosophy */}
            <section className="relative">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-gilroy-black text-black mb-6">
                    The Philosophy
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="font-gilroy-extrabold text-black mb-2">From Ads to Authentic Loyalty</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Brands don&apos;t need more promotions—they need relationships. Loyalty isn&apos;t a stamp card. It&apos;s a system of recognition.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="font-gilroy-extrabold text-black mb-2">From Customers to Stakeholders</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Your best customer isn&apos;t the one who walks in once. It&apos;s the one who comes back, again and again, and deserves to be seen.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="font-gilroy-extrabold text-black mb-2">From Ownership to Meaningful Experience</h3>
                      <p className="text-gray-700 leading-relaxed">
                        People want to feel something. They want to be part of something. Loyalty points, earned through real-life spending, become social currency.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* What We Do */}
            <section className="relative">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-gilroy-black text-black mb-6">
                    Loyalty Is the New Asset Class
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#7bc74d] transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-[#7bc74d]/10 flex items-center justify-center mb-4">
                        <Users className="w-5 h-5 text-[#7bc74d]" />
                      </div>
                      <h3 className="font-gilroy-extrabold text-black mb-2">Consumers</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Build your &quot;point wealth&quot; across multiple brands
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#7bc74d] transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-[#7bc74d]/10 flex items-center justify-center mb-4">
                        <Target className="w-5 h-5 text-[#7bc74d]" />
                      </div>
                      <h3 className="font-gilroy-extrabold text-black mb-2">Businesses</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Identify and reward your top supporters
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#7bc74d] transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-[#7bc74d]/10 flex items-center justify-center mb-4">
                        <Sparkle className="w-5 h-5 text-[#7bc74d]" />
                      </div>
                      <h3 className="font-gilroy-extrabold text-black mb-2">Communities</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Form around brand loyalty, not just transactions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* What's Next */}
            <section className="relative">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-gilroy-black text-black mb-4">
                    What&apos;s Next?
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    In this new economy, attention is currency, and loyalty is leverage. PointNow is on a mission to help 10,000 brands across Southeast Asia activate viral word-of-mouth through leaderboard rewards, build deeper relationships with their top spenders, and turn everyday customers into brand champions.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    And help millions of consumers discover local gems, compete for exclusive rewards, and build their own lifestyle &quot;Poinfolio.&quot;
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center text-white mb-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-gilroy-black mb-4">
                Join the Movement
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                If you&apos;re a customer — start earning.
                <br />
                If you&apos;re a brand — start rewarding.
                <br />
                If you&apos;re a visionary — let&apos;s talk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth?mode=user"
                  className="bg-[#7bc74d] hover:bg-[#6ab63d] text-white px-8 py-4 rounded-xl font-semibold transition-colors inline-block"
                >
                  Start Earning Points
                </Link>
                <Link
                  href="/auth?mode=business"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-colors border border-white/20 inline-block"
                >
                  Start Rewarding
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              PointNow — Because loyalty is worth more than ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



