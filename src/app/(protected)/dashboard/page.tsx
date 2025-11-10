"use client";

import React from "react";
import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-3xl font-gilroy-extrabold text-black mb-4">
              Oops!
            </h1>
            <p className="text-gray-600 mb-2 text-lg">
              You need to register as merchant or login as merchant to access this.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/auth?mode=restaurant">
                <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <Store className="w-5 h-5" />
                  Login as Merchant
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/auth?mode=restaurant&register=true">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-black font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Register as Merchant
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

