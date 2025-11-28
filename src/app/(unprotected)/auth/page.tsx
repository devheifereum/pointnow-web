import { Suspense } from "react";
import type { Metadata } from "next";
import AuthContent from "./AuthContent";

export const metadata: Metadata = {
  title: "Login or Sign Up | PointNow",
  description: "Sign in to your PointNow account or create a new account. Manage your loyalty points and rewards.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
