"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Store } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Navbar from "@/components/Navbar";
import { authApi } from "@/lib/api/auth";
import { ApiClientError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setError("Please provide a valid email address");
        setIsLoading(false);
        return;
      }

      await authApi.forgotPassword({ email: trimmedEmail });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message || "An error occurred. Please try again.");
      } else {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
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
        <Navbar />

        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md px-4 sm:px-6">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 lg:p-12">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="mb-4 flex justify-center">
                    <Store className="w-16 h-16 text-[#7bc74d]" />
                  </div>
                  <h1 className="text-2xl font-gilroy-black text-black mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {success
                      ? "Check your email for reset instructions"
                      : "Enter your email address and we&apos;ll send you a link to reset your password"}
                  </p>
                </div>

                {success ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-green-700 text-center">
                        If an account exists with that email, we&apos;ve sent you password reset instructions. Please check your inbox.
                      </p>
                    </div>
                    <Link
                      href="/auth?mode=business"
                      className="block w-full text-center text-sm text-[#7bc74d] hover:text-[#6ab63d] font-semibold"
                    >
                      Back to Login
                    </Link>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7bc74d] focus:border-transparent text-black placeholder-gray-400"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#7bc74d] hover:bg-[#6ab63d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors shadow-lg"
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </button>
                    </form>

                    <div className="mt-6 text-center">
                      <Link
                        href="/auth?mode=business"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#7bc74d] transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

