import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Loyalty Reimagined | Transform Customers Into Brand Ambassadors",
  description: "PointNow is a smart loyalty point system with a competitive twist. Gamified leaderboards, phone-based loyalty, and monthly SMS drive repeat purchases and customer retention.",
  canonical: "https://www.pointnow.io/home",
});

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PointNow",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://www.pointnow.io",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier available, Professional plan from $73/month",
    },
    description:
      "Smart loyalty point system with gamified leaderboards. Transform customers into brand ambassadors through competitive loyalty programs.",
    featureList: [
      "Phone-Based Loyalty System",
      "Gamified Leaderboards",
      "Monthly SMS Notifications",
      "Customer Rewards & Milestones",
      "Business Analytics",
      "Transaction Tracking",
      "Unlimited Customers",
      "No App Required",
      "Go Live in 2 Minutes",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "200",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar variant="transparent" />
      <LandingPage />
    </>
  );
}
