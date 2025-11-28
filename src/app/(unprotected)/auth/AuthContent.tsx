"use client";

import { useSearchParams } from "next/navigation";
import RestaurantAuthScreen from "@/views/auth/RestaurantAuthScreen";
import UserAuthScreen from "@/views/auth/UserAuthScreen";

export default function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "business"; // Default to business mode

  return mode === "user" ? <UserAuthScreen /> : <RestaurantAuthScreen />;
}

