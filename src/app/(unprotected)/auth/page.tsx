"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RestaurantAuthScreen from "@/views/auth/RestaurantAuthScreen";
import UserAuthScreen from "@/views/auth/UserAuthScreen";

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "business"; // Default to business mode

  return mode === "user" ? <UserAuthScreen /> : <RestaurantAuthScreen />;
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}

