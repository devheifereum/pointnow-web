"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Trophy,
  MessageSquare,
  Repeat,
  Users,
  Heart,
  Gift,
  MessageCircle,
  Smartphone,
  Coffee,
  ShoppingBag,
  Scissors,
  CheckCircle,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  BarChart3,
  Quote,
  type LucideIcon,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Footer from "@/components/Footer";

// TypeScript Interfaces
interface StepData {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

interface StatData {
  value: string;
  label: string;
}

interface BusinessType {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
}

interface Testimonial {
  name: string;
  role: string;
  business: string;
  quote: string;
  avatar: string;
  color: string;
}

interface TrustIndicator {
  icon: LucideIcon;
  text: string;
}

const HOW_IT_WORKS_STEPS: StepData[] = [
  {
    step: "01",
    icon: Phone,
    title: "Customer Purchases",
    description: "Staff enters phone number and purchase amount. Points are instantly added.",
    color: "from-[#7bc74d] to-[#6ab63d]",
  },
  {
    step: "02",
    icon: Trophy,
    title: "Climb the Leaderboard",
    description: "Customers see their ranking and compete to reach the top positions.",
    color: "from-purple-500 to-purple-600",
  },
  {
    step: "03",
    icon: Repeat,
    title: "Return & Reward",
    description: "Gamification drives repeat visits. Customers earn rewards and stay loyal.",
    color: "from-[#6ab63d] to-[#7bc74d]",
  },
];

const RESULTS_STATS: StatData[] = [
  { value: "3x", label: "More Repeat Visits" },
  { value: "85%", label: "Customer Retention" },
  { value: "2x", label: "Average Spend" },
  { value: "50%", label: "Less Marketing Cost" },
];

const BUSINESS_TYPES: BusinessType[] = [
  { icon: Coffee, label: "Cafés", color: "bg-orange-500", bg: "bg-orange-50" },
  { icon: ShoppingBag, label: "Retail", color: "bg-purple-500", bg: "bg-purple-50" },
  { icon: Scissors, label: "Salons", color: "bg-pink-500", bg: "bg-pink-50" },
  { icon: Users, label: "Fitness", color: "bg-[#7bc74d]", bg: "bg-green-50" },
  { icon: Heart, label: "Healthcare", color: "bg-red-500", bg: "bg-red-50" },
  { icon: Smartphone, label: "Services", color: "bg-[#7bc74d]", bg: "bg-green-50" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Pomello Cafe",
    role: "Owner",
    business: "Pomello Cafe",
    quote: "PointNow has transformed how we engage with customers. The leaderboard creates friendly competition and our repeat visits have increased significantly since launching.",
    avatar: "PC",
    color: "bg-orange-500",
  },
  {
    name: "GTR Burger",
    role: "Founder",
    business: "GTR Burger Padang Serai",
    quote: "Our customers love tracking their points and competing for top spots. The gamification keeps them coming back for our premium burgers. Revenue is up 200%!",
    avatar: "GB",
    color: "bg-red-500",
  },
  {
    name: "Shafiie Dessert",
    role: "Owner",
    business: "Shafiie Dessert",
    quote: "The SMS reminders are perfect for our dessert business. Customers get notified about their rewards and it drives repeat orders. Simple setup, amazing results!",
    avatar: "SD",
    color: "bg-pink-500",
  },
  {
    name: "Coffee Art",
    role: "Manager",
    business: "Coffee Art",
    quote: "PointNow helps us build lasting relationships with our coffee lovers. The phone-based system is so convenient - no app needed. Our regulars love it!",
    avatar: "CA",
    color: "bg-amber-600",
  },
  {
    name: "Lace Gallery",
    role: "Owner",
    business: "Lace Gallery",
    quote: "As a specialty store, customer loyalty is everything. PointNow's analytics help us understand our customers better, and the rewards system keeps them coming back.",
    avatar: "LG",
    color: "bg-purple-500",
  },
];

const TRUST_INDICATORS: TrustIndicator[] = [
  { icon: CheckCircle, text: "Setup in 2 minutes" },
  { icon: CheckCircle, text: "No credit card required" },
  { icon: CheckCircle, text: "Cancel anytime" },
];

const PARTNER_ICONS = [Coffee, ShoppingBag, Scissors, Users, Trophy];

// Reusable Components
interface BadgeProps {
  icon: LucideIcon;
  text: string;
  className?: string;
}

function Badge({ icon: Icon, text, className = "" }: BadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 bg-[#7bc74d]/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 backdrop-blur-sm border border-[#7bc74d]/20 shadow-sm ${className}`}>
      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#7bc74d] flex-shrink-0" aria-hidden="true" />
      <span className="text-xs sm:text-sm font-semibold text-[#7bc74d] tracking-wide break-words">{text}</span>
    </div>
  );
}

interface StatCardProps {
  value: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

function StatCard({ value, icon: Icon, title, description }: StatCardProps) {
  return (
    <div className="group relative bg-white/15 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 lg:p-10 text-center border border-white/30 shadow-2xl active:bg-white/20 active:scale-[0.98] transition-all duration-200 overflow-hidden touch-manipulation">
      {/* Subtle gradient overlay on active */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
      <div className="relative z-10">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-gilroy-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight">{value}</div>
        <div className="flex justify-center mb-3 sm:mb-4 md:mb-6" aria-hidden="true">
          <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-active:bg-white/30 transition-colors duration-200">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-9 lg:h-9 text-white" />
          </div>
        </div>
        <div className="text-white font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{title}</div>
        <div className="text-white/70 text-xs sm:text-sm">{description}</div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - White background */}
      <section className="relative overflow-hidden bg-white text-gray-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <AnimatedGridPattern
            width={60}
            height={60}
            numSquares={50}
            maxOpacity={0.05}
            duration={4}
          />
        </div>
        
        {/* Decorative Shapes - More sophisticated positioning */}
        <div className="absolute top-20 right-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#7bc74d]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[#7bc74d]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#7bc74d]/3 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-14 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-5 sm:space-y-6 md:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-block animate-fade-in">
                <Badge 
                  icon={Sparkles} 
                  text="Full Service Business Growth" 
                  className="bg-[#7bc74d]/15 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 border border-[#7bc74d]/20 shadow-lg text-xs sm:text-sm max-w-full" 
                />
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-gilroy-black text-gray-900 leading-[1.15] sm:leading-[1.1] tracking-tight px-2 sm:px-0">
                One Loyalty Platform For All
                <br className="hidden sm:block" />
                <span className="block sm:inline"> </span>
                <span className="relative inline-block mt-1 sm:mt-0">
                  Types Of <span className="relative inline-block">
                    <span className="text-[#7bc74d]">Business</span>
                    <span className="absolute -bottom-1.5 sm:-bottom-2 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-[#7bc74d]/50 via-[#7bc74d] to-transparent rounded-full"></span>
                  </span>
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0 font-light">
                A cloud-based online loyalty platform that can take your business potential to the highest level, both online and offline.
              </p>

              {/* CTA Button */}
              <div className="pt-3 sm:pt-4">
                <Link href="/auth?mode=business" className="block w-full sm:w-auto">
                  <button 
                    className="group relative bg-[#7bc74d] active:bg-[#6ab63d] text-white px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 rounded-2xl font-semibold text-base sm:text-lg md:text-xl transition-all duration-200 shadow-2xl active:scale-[0.98] hover:shadow-[#7bc74d]/40 w-full sm:w-auto inline-flex items-center justify-center gap-3 overflow-hidden touch-manipulation"
                    aria-label="Get started with PointNow for free"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-transform group-active:translate-x-1" aria-hidden="true" />
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] opacity-0 group-active:opacity-100 transition-opacity"></span>
                  </button>
                </Link>
              </div>

              {/* Partner Logos */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-6 pt-6 sm:pt-8" aria-label="Supported business types">
                <span className="text-xs sm:text-sm text-gray-600 font-medium w-full sm:w-auto mb-2 sm:mb-0">Trusted by:</span>
                {PARTNER_ICONS.map((Icon, index) => (
                  <div
                    key={index}
                    className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center border border-gray-200 active:bg-gray-200 active:scale-95 transition-all duration-200 touch-manipulation"
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-700" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Mobile Mockup */}
            <div className="relative hidden lg:flex justify-center items-center">
              {/* Glow effect behind phone */}
              <div className="absolute inset-0 bg-[#7bc74d]/20 rounded-full blur-3xl scale-150"></div>
              
              {/* Mobile Device Frame */}
              <div className="relative w-80 h-[640px] bg-white rounded-[3.5rem] p-3 shadow-2xl border-4 border-gray-200 transform hover:scale-105 transition-transform duration-500">
                {/* Inner white border/padding */}
                <div className="w-full h-full bg-white rounded-[3rem] px-4 overflow-hidden">
                  {/* Screen content */}
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-white shadow-inner">
                    {/* Web Interface Screenshot */}
                    <Image 
                      src="/mobile-ui.svg" 
                      alt="PointNow - Leaderboard Interface" 
                      fill
                      className="object-cover"
                      style={{ objectPosition: 'top center' }}
                      priority
                    />
                  </div>
                </div>
                {/* Notch */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gray-200 rounded-b-2xl shadow-lg"></div>
                {/* Side Buttons - More realistic */}
                <div className="absolute right-[-5px] top-36 w-1.5 h-14 bg-gray-300 rounded-l-md"></div>
                <div className="absolute left-[-5px] top-32 w-1.5 h-10 bg-gray-300 rounded-r-md"></div>
                <div className="absolute left-[-5px] top-44 w-1.5 h-10 bg-gray-300 rounded-r-md"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Green background with glass cards */}
      <section className="relative bg-gradient-to-br from-[#6ab63d] via-[#7bc74d] to-[#6ab63d] py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
        {/* Decorative circles - More sophisticated */}
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white/8 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-gilroy-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight px-2">
              Trusted by Growing Businesses
            </h2>
            <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light px-4">
              Boost revenue, gain insights that help you grow and scale faster
            </p>
          </div>

          {/* Stats Grid with Glass Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            <StatCard
              value="2 min"
              icon={Clock}
              title="Quick Setup"
              description="Get started in minutes"
            />
            <StatCard
              value="100%"
              icon={TrendingUp}
              title="Web-Based"
              description="No app download needed"
            />
            <StatCard
              value="8+"
              icon={ShoppingBag}
              title="Active Businesses"
              description="Growing every day"
            />
          </div>
        </div>
      </section>

      {/* What is PointNow - Bento Grid Style */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-18 lg:mb-24">
            <div className="inline-block mb-5 sm:mb-6 md:mb-8">
              <Badge icon={Zap} text="Why PointNow" className="mb-6 text-xs sm:text-sm" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-gilroy-black text-gray-900 mb-4 sm:mb-6 md:mb-8 tracking-tight leading-[1.15] sm:leading-[1.1] px-2">
              The Loyalty Platform That
              <br />
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="text-[#7bc74d]">Actually Works</span>
                <span className="absolute -bottom-1.5 sm:-bottom-2 md:-bottom-3 left-0 right-0 h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-[#7bc74d]/30 via-[#7bc74d]/50 to-transparent rounded-full"></span>
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light px-4">
              Turn one-time customers into lifelong fans with gamified loyalty that creates real engagement
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {/* Large Feature Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-gray-900 relative overflow-hidden group border border-gray-200 shadow-2xl active:shadow-[#7bc74d]/20 transition-all duration-200 touch-manipulation">
              {/* Animated gradient overlay */}
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-[#7bc74d]/20 rounded-full blur-3xl group-active:bg-[#7bc74d]/30 group-active:scale-150 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[#7bc74d]/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-2xl sm:rounded-3xl flex items-center justify-center mb-5 sm:mb-6 md:mb-8 shadow-lg group-active:scale-110 group-active:rotate-3 transition-transform duration-200">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-gilroy-black text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">Gamified Leaderboards</h3>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl font-light">
                  Create friendly competition among your customers. Public rankings drive repeat visits as customers compete to become top spenders at your business.
                </p>
              </div>
            </div>

            {/* Phone-Based */}
            <div className="relative bg-gradient-to-br from-white via-white/80 to-green-50/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 group active:shadow-2xl transition-all duration-200 border border-green-100/50 active:border-[#7bc74d]/30 overflow-hidden touch-manipulation">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#7bc74d]/20 rounded-full blur-2xl group-active:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-active:scale-110 group-active:rotate-3 transition-all duration-200 shadow-lg">
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-gilroy-black text-gray-900 mb-2 sm:mb-3 md:mb-4">Phone-Based</h3>
                <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base font-light">
                  No app download needed. Customers identified by phone number for seamless experience.
                </p>
              </div>
            </div>

            {/* SMS Reminders */}
            <div className="relative bg-gradient-to-br from-purple-50 via-purple-50/80 to-purple-100/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 group active:shadow-2xl transition-all duration-200 border border-purple-100/50 active:border-purple-200 overflow-hidden touch-manipulation">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-purple-200/30 rounded-full blur-2xl group-active:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-active:scale-110 group-active:rotate-3 transition-all duration-200 shadow-lg">
                  <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-gilroy-black text-gray-900 mb-2 sm:mb-3 md:mb-4">Smart SMS</h3>
                <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base font-light">
                  Automated monthly reminders about rewards and leaderboard status keep customers engaged.
                </p>
              </div>
            </div>

            {/* Rewards */}
            <div className="relative bg-gradient-to-br from-pink-50 via-pink-50/80 to-pink-100/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 group active:shadow-2xl transition-all duration-200 border border-pink-100/50 active:border-pink-200 overflow-hidden touch-manipulation">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-pink-200/30 rounded-full blur-2xl group-active:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-active:scale-110 group-active:rotate-3 transition-all duration-200 shadow-lg">
                  <Gift className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-gilroy-black text-gray-900 mb-2 sm:mb-3 md:mb-4">Smart Rewards</h3>
                <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base font-light">
                  Set milestone rewards that increase customer lifetime value and drive repeat purchases.
                </p>
              </div>
            </div>

            {/* Analytics */}
            <div className="relative bg-gradient-to-br from-green-50 via-green-50/80 to-[#7bc74d]/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 group active:shadow-2xl transition-all duration-200 border border-green-100/50 active:border-[#7bc74d]/30 overflow-hidden touch-manipulation">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#7bc74d]/20 rounded-full blur-2xl group-active:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-active:scale-110 group-active:rotate-3 transition-all duration-200 shadow-lg">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-gilroy-black text-gray-900 mb-2 sm:mb-3 md:mb-4">Real Analytics</h3>
                <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base font-light">
                  Track customer behavior, spending patterns, and loyalty program performance in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-18 lg:mb-24">
            <div className="inline-block mb-5 sm:mb-6 md:mb-8">
              <Badge icon={Clock} text="Get Started in Minutes" className="mb-6 text-xs sm:text-sm" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-gilroy-black text-gray-900 mb-4 sm:mb-6 md:mb-8 tracking-tight leading-[1.15] sm:leading-[1.1] px-2">
              How It <span className="text-[#7bc74d]">Works</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light px-4">
              Simple, powerful, and effective. See results from day one.
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#7bc74d] via-[#7bc74d] to-[#7bc74d] transform -translate-y-1/2 rounded-full"></div>
            
            <div className="grid md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
              {HOW_IT_WORKS_STEPS.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl active:shadow-2xl transition-all duration-200 border border-gray-100 active:border-gray-200 active:-translate-y-1 touch-manipulation">
                    {/* Step Number */}
                    <div className={`relative w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 bg-gradient-to-br ${item.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-5 sm:mb-6 md:mb-8 mx-auto lg:mx-0 shadow-2xl group-active:scale-110 group-active:rotate-3 transition-all duration-200`}>
                      <item.icon className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 text-white" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl sm:rounded-3xl opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
                    </div>
                    
                    {/* Step Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4 md:mb-6 border border-gray-200">
                      <span className="text-xs font-bold text-gray-600 tracking-wider">STEP {item.step}</span>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-gilroy-black text-gray-900 mb-3 sm:mb-4 md:mb-5 leading-tight">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg font-light">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Banner */}
          <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 relative overflow-hidden border border-gray-200 shadow-2xl">
            <div className="absolute top-0 right-0 w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] bg-[#7bc74d]/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[400px] md:h-[400px] bg-[#7bc74d]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-14">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-gilroy-black text-gray-900 mb-3 sm:mb-4 md:mb-6 tracking-tight px-2">
                  The Results Speak For Themselves
                </h3>
                <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#7bc74d] to-transparent mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
                {RESULTS_STATS.map((stat, index) => (
                  <div key={index} className="text-center group touch-manipulation">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-gilroy-black text-[#7bc74d] mb-1 sm:mb-2 md:mb-3 group-active:scale-110 transition-transform duration-200">{stat.value}</div>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types - Modern Card Grid */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-18 lg:mb-24">
            <div className="inline-block mb-5 sm:mb-6 md:mb-8">
              <Badge icon={Shield} text="Works for Everyone" className="mb-6 text-xs sm:text-sm" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-gilroy-black text-gray-900 mb-4 sm:mb-6 md:mb-8 tracking-tight leading-[1.15] sm:leading-[1.1] px-2">
              Built for <span className="text-[#7bc74d]">Your Business</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light px-4">
              From cafés to salons, retail to services - PointNow adapts to your needs
            </p>
          </div>

          {/* Business Type Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-10 sm:mb-14 md:mb-18 lg:mb-20">
            {BUSINESS_TYPES.map((business, index) => (
              <div key={index} className={`relative ${business.bg} rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 text-center group active:shadow-2xl transition-all duration-200 cursor-pointer border border-transparent active:border-gray-200 overflow-hidden touch-manipulation`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/50 opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 ${business.color} rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 group-active:scale-110 group-active:rotate-3 transition-all duration-200 shadow-xl`}>
                  <business.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <p className="relative font-gilroy-extrabold text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg">{business.label}</p>
              </div>
            ))}
          </div>

          {/* Join Banner */}
          <div className="relative bg-gradient-to-br from-[#7bc74d]/10 via-[#7bc74d]/5 to-[#6ab63d]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 border border-[#7bc74d]/30 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[#7bc74d]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-gilroy-black text-gray-900 mb-2 sm:mb-3 md:mb-4 tracking-tight">
                  Join Growing Businesses
                </h3>
                <p className="text-gray-600 text-base sm:text-lg md:text-xl font-light">
                  Start building customer loyalty today
                </p>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-gilroy-black text-[#7bc74d] mb-1 sm:mb-2">8+</div>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Active Businesses</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-gilroy-black text-[#7bc74d] mb-1 sm:mb-2">100%</div>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Web-Based</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Card Design */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-18 lg:mb-24">
            <div className="inline-block mb-5 sm:mb-6 md:mb-8">
              <Badge icon={Quote} text="Testimonials" className="mb-6 text-xs sm:text-sm" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-gilroy-black text-gray-900 mb-4 sm:mb-6 md:mb-8 tracking-tight leading-[1.15] sm:leading-[1.1] px-2">
              Loved by <span className="text-[#7bc74d]">Businesses</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light px-4">
              See what our customers have to say about PointNow
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
            {TESTIMONIALS.slice(0, 3).map((testimonial, index) => (
              <article key={index} className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl active:shadow-2xl transition-all duration-200 border border-gray-100 active:border-gray-200 active:-translate-y-1 overflow-hidden touch-manipulation">
                {/* Background gradient on active */}
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#7bc74d]/5 to-transparent rounded-full blur-2xl opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
                
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#7bc74d]/10 to-[#7bc74d]/5 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-5 sm:mb-6 md:mb-8 group-active:scale-110 transition-transform duration-200">
                    <Quote className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-[#7bc74d]" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex gap-1 sm:gap-1.5 mb-5 sm:mb-6 md:mb-8" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-5 sm:mb-6 md:mb-8 lg:mb-10 font-light">&ldquo;{testimonial.quote}&rdquo;</p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-5 pt-3 sm:pt-4 md:pt-6 border-t border-gray-100">
                    <div 
                      className={`w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 ${testimonial.color} rounded-2xl sm:rounded-3xl flex items-center justify-center text-white font-gilroy-black text-sm sm:text-base md:text-lg lg:text-xl shadow-lg group-active:scale-110 transition-transform duration-200`}
                      aria-hidden="true"
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-gilroy-extrabold text-gray-900 text-sm sm:text-base md:text-lg">{testimonial.name}</p>
                      <p className="text-gray-500 text-xs sm:text-sm font-medium">
                        <span className="sr-only">Role: </span>
                        {testimonial.role}, {testimonial.business}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Full Width White */}
      <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 xl:py-48 bg-white text-gray-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-[#7bc74d]/12 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-[#7bc74d]/12 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[800px] md:h-[800px] bg-[#7bc74d]/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]">
          <AnimatedGridPattern
            width={60}
            height={60}
            numSquares={30}
            maxOpacity={0.05}
            duration={4}
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-5 sm:mb-6 md:mb-8 lg:mb-10">
            <Badge 
              icon={Sparkles} 
              text="Start Today" 
              className="bg-[#7bc74d]/20 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 border border-[#7bc74d]/30 shadow-lg text-xs sm:text-sm" 
            />
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-gilroy-black text-gray-900 mb-5 sm:mb-6 md:mb-8 lg:mb-10 leading-[1.1] sm:leading-[0.95] tracking-tight px-2">
            Ready to Transform Your 
            <br />
            <span className="relative inline-block mt-1 sm:mt-0">
              <span className="text-[#7bc74d]">Business</span>?
              <span className="absolute -bottom-1.5 sm:-bottom-2 md:-bottom-3 left-0 right-0 h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-transparent via-[#7bc74d]/50 to-transparent rounded-full"></span>
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-600 mb-8 sm:mb-10 md:mb-12 lg:mb-16 leading-relaxed max-w-4xl mx-auto font-light px-4">
            Join thousands of businesses using PointNow to build lasting customer relationships
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 px-4">
            <Link href="/auth?mode=business" className="w-full sm:w-auto">
              <button 
                className="group relative bg-[#7bc74d] active:bg-[#6ab63d] text-white px-7 py-4 sm:px-8 sm:py-4.5 md:px-10 md:py-5 lg:px-12 lg:py-6 rounded-2xl font-semibold text-base sm:text-lg md:text-xl transition-all duration-200 shadow-2xl active:shadow-[#7bc74d]/40 active:scale-[0.98] w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 overflow-hidden touch-manipulation"
                aria-label="Get started with PointNow for free"
              >
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-transform group-active:translate-x-1" aria-hidden="true" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] opacity-0 group-active:opacity-100 transition-opacity duration-200"></span>
              </button>
            </Link>
            <Link href="/businesses" className="w-full sm:w-auto">
              <button 
                className="bg-gray-100 active:bg-gray-200 text-gray-900 px-7 py-4 sm:px-8 sm:py-4.5 md:px-10 md:py-5 lg:px-12 lg:py-6 rounded-2xl font-semibold text-base sm:text-lg md:text-xl transition-all duration-200 border border-gray-200 active:border-gray-300 active:scale-[0.98] w-full sm:w-auto shadow-lg touch-manipulation"
                aria-label="View PointNow demo"
              >
                View Demo
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-gray-600 mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-4">
            {TRUST_INDICATORS.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base">
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#7bc74d]" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="pt-5 sm:pt-6 md:pt-8 border-t border-gray-200 px-4">
            <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base">Questions? We&apos;re here to help</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              <a 
                href="tel:+601162464247" 
                className="flex items-center gap-2 sm:gap-3 text-gray-900 active:text-[#7bc74d] transition group text-xs sm:text-sm md:text-base touch-manipulation"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center group-active:bg-[#7bc74d]/20 transition">
                  <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                </div>
                <span className="font-medium">+60 11-6246 4247</span>
              </a>
              <a 
                href="mailto:hello@pointnow.io" 
                className="flex items-center gap-2 sm:gap-3 text-gray-900 active:text-[#7bc74d] transition group text-xs sm:text-sm md:text-base touch-manipulation"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center group-active:bg-[#7bc74d]/20 transition">
                  <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                </div>
                <span className="font-medium break-all">hello@pointnow.io</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
