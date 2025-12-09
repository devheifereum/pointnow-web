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
    color: "from-blue-500 to-blue-600",
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
  { icon: Users, label: "Fitness", color: "bg-blue-500", bg: "bg-blue-50" },
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
    <div className={`inline-flex items-center gap-2.5 bg-[#7bc74d]/10 rounded-full px-5 py-2.5 backdrop-blur-sm border border-[#7bc74d]/20 shadow-sm ${className}`}>
      <Icon className="w-4 h-4 text-[#7bc74d]" aria-hidden="true" />
      <span className="text-sm font-semibold text-[#7bc74d] tracking-wide">{text}</span>
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
    <div className="group relative bg-white/15 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 hover:shadow-white/20 transition-all duration-500 overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="text-7xl md:text-8xl font-gilroy-black text-white mb-6 tracking-tight">{value}</div>
        <div className="flex justify-center mb-6" aria-hidden="true">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
            <Icon className="w-9 h-9 text-white" />
          </div>
        </div>
        <div className="text-white font-semibold text-lg mb-2">{title}</div>
        <div className="text-white/70 text-sm">{description}</div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Dark background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <AnimatedGridPattern
            width={60}
            height={60}
            numSquares={50}
            maxOpacity={0.1}
            duration={4}
          />
        </div>
        
        {/* Decorative Shapes - More sophisticated positioning */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#7bc74d]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-[#7bc74d]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7bc74d]/3 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-block">
                <Badge 
                  icon={Sparkles} 
                  text="Full Service Business Growth And Development" 
                  className="bg-[#7bc74d]/15 backdrop-blur-md px-6 py-2.5 border border-[#7bc74d]/20 shadow-lg" 
                />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-gilroy-black text-white leading-[1.1] tracking-tight">
                One Loyalty Platform For All
                <br />
                <span className="relative">
                  Types Of <span className="relative inline-block">
                    <span className="text-[#7bc74d]">Business</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#7bc74d]/50 via-[#7bc74d] to-transparent rounded-full"></span>
                  </span>
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
                A cloud-based online loyalty platform that can take your business potential to the highest level, both online and offline.
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Link href="/auth?mode=business">
                  <button 
                    className="group relative bg-[#7bc74d] hover:bg-[#6ab63d] text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-[#7bc74d]/40 hover:scale-[1.02] inline-flex items-center gap-3 overflow-hidden"
                    aria-label="Get started with PointNow for free"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </button>
                </Link>
              </div>

              {/* Partner Logos */}
              <div className="flex items-center gap-8 pt-8 opacity-70" aria-label="Supported business types">
                <span className="text-sm text-gray-400 font-medium mr-2">Trusted by:</span>
                {PARTNER_ICONS.map((Icon, index) => (
                  <div
                    key={index}
                    className="w-14 h-14 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 hover:scale-110 transition-all duration-300 cursor-pointer"
                    aria-hidden="true"
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Mobile Mockup */}
            <div className="relative hidden lg:flex justify-center items-center">
              {/* Glow effect behind phone */}
              <div className="absolute inset-0 bg-[#7bc74d]/20 rounded-full blur-3xl scale-150"></div>
              
              {/* Mobile Device Frame */}
              <div className="relative w-80 h-[640px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3.5rem] p-3 shadow-2xl border-4 border-gray-700/50 transform hover:scale-105 transition-transform duration-500">
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
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gray-900 rounded-b-2xl shadow-lg"></div>
                {/* Side Buttons - More realistic */}
                <div className="absolute right-[-5px] top-36 w-1.5 h-14 bg-gray-700/80 rounded-l-md"></div>
                <div className="absolute left-[-5px] top-32 w-1.5 h-10 bg-gray-700/80 rounded-r-md"></div>
                <div className="absolute left-[-5px] top-44 w-1.5 h-10 bg-gray-700/80 rounded-r-md"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Green background with glass cards */}
      <section className="relative bg-gradient-to-br from-[#6ab63d] via-[#7bc74d] to-[#6ab63d] py-28 overflow-hidden">
        {/* Decorative circles - More sophisticated */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/8 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-gilroy-black text-white mb-6 tracking-tight">
              Trusted by Growing Businesses
            </h2>
            <p className="text-white/90 text-xl max-w-3xl mx-auto leading-relaxed font-light">
              Boost revenue, gain insights that help you grow and scale faster
            </p>
          </div>

          {/* Stats Grid with Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="py-32 md:py-40 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-block mb-8">
              <Badge icon={Zap} text="Why PointNow" className="mb-6" />
            </div>
            <h2 className="text-5xl md:text-7xl font-gilroy-black text-gray-900 mb-8 tracking-tight leading-[1.1]">
              The Loyalty Platform That
              <br />
              <span className="relative inline-block">
                <span className="text-[#7bc74d]">Actually Works</span>
                <span className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-[#7bc74d]/30 via-[#7bc74d]/50 to-transparent rounded-full"></span>
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Turn one-time customers into lifelong fans with gamified loyalty that creates real engagement
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Large Feature Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-white relative overflow-hidden group border border-gray-700/50 shadow-2xl hover:shadow-[#7bc74d]/20 transition-all duration-500">
              {/* Animated gradient overlay */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#7bc74d]/20 rounded-full blur-3xl group-hover:bg-[#7bc74d]/30 group-hover:scale-150 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7bc74d]/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-4xl font-gilroy-black mb-6 leading-tight">Gamified Leaderboards</h3>
                <p className="text-gray-300 text-xl leading-relaxed max-w-2xl font-light">
                  Create friendly competition among your customers. Public rankings drive repeat visits as customers compete to become top spenders at your business.
                </p>
              </div>
            </div>

            {/* Phone-Based */}
            <div className="relative bg-gradient-to-br from-blue-50 via-blue-50/80 to-blue-100/50 rounded-3xl p-10 group hover:shadow-2xl transition-all duration-500 border border-blue-100/50 hover:border-blue-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-gilroy-black text-gray-900 mb-4">Phone-Based</h3>
                <p className="text-gray-600 leading-relaxed text-base font-light">
                  No app download needed. Customers identified by phone number for seamless experience.
                </p>
              </div>
            </div>

            {/* SMS Reminders */}
            <div className="relative bg-gradient-to-br from-purple-50 via-purple-50/80 to-purple-100/50 rounded-3xl p-10 group hover:shadow-2xl transition-all duration-500 border border-purple-100/50 hover:border-purple-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-gilroy-black text-gray-900 mb-4">Smart SMS</h3>
                <p className="text-gray-600 leading-relaxed text-base font-light">
                  Automated monthly reminders about rewards and leaderboard status keep customers engaged.
                </p>
              </div>
            </div>

            {/* Rewards */}
            <div className="relative bg-gradient-to-br from-pink-50 via-pink-50/80 to-pink-100/50 rounded-3xl p-10 group hover:shadow-2xl transition-all duration-500 border border-pink-100/50 hover:border-pink-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-gilroy-black text-gray-900 mb-4">Smart Rewards</h3>
                <p className="text-gray-600 leading-relaxed text-base font-light">
                  Set milestone rewards that increase customer lifetime value and drive repeat purchases.
                </p>
              </div>
            </div>

            {/* Analytics */}
            <div className="relative bg-gradient-to-br from-green-50 via-green-50/80 to-[#7bc74d]/10 rounded-3xl p-10 group hover:shadow-2xl transition-all duration-500 border border-green-100/50 hover:border-[#7bc74d]/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7bc74d]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-gilroy-black text-gray-900 mb-4">Real Analytics</h3>
                <p className="text-gray-600 leading-relaxed text-base font-light">
                  Track customer behavior, spending patterns, and loyalty program performance in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-32 md:py-40 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-block mb-8">
              <Badge icon={Clock} text="Get Started in Minutes" className="mb-6" />
            </div>
            <h2 className="text-5xl md:text-7xl font-gilroy-black text-gray-900 mb-8 tracking-tight leading-[1.1]">
              How It <span className="text-[#7bc74d]">Works</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Simple, powerful, and effective. See results from day one.
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#7bc74d] via-[#7bc74d] to-[#7bc74d] transform -translate-y-1/2 rounded-full"></div>
            
            <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
              {HOW_IT_WORKS_STEPS.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 hover:-translate-y-2">
                    {/* Step Number */}
                    <div className={`relative w-24 h-24 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mb-8 mx-auto lg:mx-0 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <item.icon className="w-12 h-12 text-white" />
                      <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Step Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-4 py-2 mb-6 border border-gray-200">
                      <span className="text-xs font-bold text-gray-600 tracking-wider">STEP {item.step}</span>
                    </div>
                    
                    <h3 className="text-3xl font-gilroy-black text-gray-900 mb-5 leading-tight">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg font-light">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Banner */}
          <div className="mt-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 md:p-16 relative overflow-hidden border border-gray-700/50 shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7bc74d]/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7bc74d]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="text-center mb-14">
                <h3 className="text-4xl md:text-5xl font-gilroy-black text-white mb-6 tracking-tight">
                  The Results Speak For Themselves
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#7bc74d] to-transparent mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {RESULTS_STATS.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-5xl md:text-6xl font-gilroy-black text-[#7bc74d] mb-3 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                    <p className="text-white/90 text-base font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types - Modern Card Grid */}
      <section className="py-32 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-block mb-8">
              <Badge icon={Shield} text="Works for Everyone" className="mb-6" />
            </div>
            <h2 className="text-5xl md:text-7xl font-gilroy-black text-gray-900 mb-8 tracking-tight leading-[1.1]">
              Built for <span className="text-[#7bc74d]">Your Business</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              From cafés to salons, retail to services - PointNow adapts to your needs
            </p>
          </div>

          {/* Business Type Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
            {BUSINESS_TYPES.map((business, index) => (
              <div key={index} className={`relative ${business.bg} rounded-3xl p-8 text-center group hover:shadow-2xl transition-all duration-500 cursor-pointer border border-transparent hover:border-gray-200 overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`relative w-20 h-20 ${business.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                  <business.icon className="w-10 h-10 text-white" />
                </div>
                <p className="relative font-gilroy-extrabold text-gray-900 text-lg">{business.label}</p>
              </div>
            ))}
          </div>

          {/* Join Banner */}
          <div className="relative bg-gradient-to-br from-[#7bc74d]/10 via-[#7bc74d]/5 to-[#6ab63d]/10 rounded-3xl p-12 md:p-16 border border-[#7bc74d]/30 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7bc74d]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <h3 className="text-4xl font-gilroy-black text-gray-900 mb-4 tracking-tight">
                  Join Growing Businesses
                </h3>
                <p className="text-gray-600 text-xl font-light">
                  Start building customer loyalty today
                </p>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <div className="text-5xl font-gilroy-black text-[#7bc74d] mb-2">8+</div>
                  <p className="text-gray-600 text-base font-medium">Active Businesses</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-gilroy-black text-[#7bc74d] mb-2">100%</div>
                  <p className="text-gray-600 text-base font-medium">Web-Based</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Card Design */}
      <section className="py-32 md:py-40 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-block mb-8">
              <Badge icon={Quote} text="Testimonials" className="mb-6" />
            </div>
            <h2 className="text-5xl md:text-7xl font-gilroy-black text-gray-900 mb-8 tracking-tight leading-[1.1]">
              Loved by <span className="text-[#7bc74d]">Businesses</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              See what our customers have to say about PointNow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {TESTIMONIALS.slice(0, 3).map((testimonial, index) => (
              <article key={index} className="relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 group hover:-translate-y-2 overflow-hidden">
                {/* Background gradient on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7bc74d]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7bc74d]/10 to-[#7bc74d]/5 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Quote className="w-8 h-8 text-[#7bc74d]" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex gap-1.5 mb-8" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 text-xl leading-relaxed mb-10 font-light">&ldquo;{testimonial.quote}&rdquo;</p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-5 pt-6 border-t border-gray-100">
                    <div 
                      className={`w-16 h-16 ${testimonial.color} rounded-3xl flex items-center justify-center text-white font-gilroy-black text-xl shadow-lg group-hover:scale-110 transition-transform duration-500`}
                      aria-hidden="true"
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-gilroy-extrabold text-gray-900 text-lg">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm font-medium">
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

      {/* Final CTA - Full Width Dark */}
      <section className="relative py-32 md:py-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#7bc74d]/12 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#7bc74d]/12 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7bc74d]/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]">
          <AnimatedGridPattern
            width={60}
            height={60}
            numSquares={30}
            maxOpacity={0.1}
            duration={4}
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-10">
            <Badge 
              icon={Sparkles} 
              text="Start Today" 
              className="bg-[#7bc74d]/20 backdrop-blur-md px-6 py-3 border border-[#7bc74d]/30 shadow-lg" 
            />
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-gilroy-black mb-10 leading-[0.95] tracking-[-0.02em]">
            Ready to Transform Your 
            <br />
            <span className="relative inline-block">
              <span className="text-[#7bc74d]">Business</span>?
              <span className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#7bc74d]/50 to-transparent rounded-full"></span>
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
            Join thousands of businesses using PointNow to build lasting customer relationships
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link href="/auth?mode=business">
              <button 
                className="group relative bg-[#7bc74d] hover:bg-[#6ab63d] text-white px-12 py-6 rounded-2xl font-semibold text-xl transition-all duration-300 shadow-2xl hover:shadow-[#7bc74d]/40 hover:scale-105 w-full sm:w-auto inline-flex items-center gap-3 overflow-hidden"
                aria-label="Get started with PointNow for free"
              >
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </Link>
            <Link href="/businesses">
              <button 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-12 py-6 rounded-2xl font-semibold text-xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 w-full sm:w-auto shadow-lg"
                aria-label="View PointNow demo"
              >
                View Demo
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 mb-16">
            {TRUST_INDICATORS.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <item.icon className="w-5 h-5 text-[#7bc74d]" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-gray-400 mb-6">Questions? We&apos;re here to help</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              <a 
                href="tel:+601162464247" 
                className="flex items-center gap-3 text-white hover:text-[#7bc74d] transition group"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#7bc74d]/20 transition">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="font-medium">+60 11-6246 4247</span>
              </a>
              <a 
                href="mailto:hello@pointnow.io" 
                className="flex items-center gap-3 text-white hover:text-[#7bc74d] transition group"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#7bc74d]/20 transition">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">hello@pointnow.io</span>
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
