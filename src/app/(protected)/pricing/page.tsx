import PricingScreen from "@/views/pricing/PricingScreen";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Pricing - Free Forever for Unlimited Customers",
  description: "PointNow is free forever for unlimited customers. No hidden fees, no credit card required. Start your loyalty program today.",
  canonical: "https://pointnow.io/pricing",
});

export default function PricingPage() {
  return <PricingScreen />;
}


