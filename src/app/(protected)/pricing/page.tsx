import PricingScreen from "@/views/pricing/PricingScreen";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Pricing - Free Forever for Unlimited Customers",
  description: "PointNow is free forever for unlimited customers. No hidden fees, no credit card required. Start your loyalty program today.",
  canonical: "https://www.pointnow.io/pricing",
});

export default function PricingPage() {
  // Server-rendered content for SEO - Google can see this immediately
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Pricing - PointNow",
            description: "PointNow is free forever for unlimited customers. No hidden fees, no credit card required.",
            url: "https://www.pointnow.io/pricing",
            mainEntity: {
              "@type": "Offer",
              name: "Free Forever Plan",
              price: "0",
              priceCurrency: "USD",
              description: "Free forever for unlimited customers",
            },
          }),
        }}
      />
      {/* Initial content visible to Googlebot */}
      <div className="sr-only">
        <h1>Pricing - Free Forever for Unlimited Customers</h1>
        <p>
          PointNow is free forever for unlimited customers. No hidden fees, no credit card required. Start your loyalty program today.
        </p>
        <p>
          Our pricing plans include a free forever plan with unlimited customers, professional plans for growing businesses, and enterprise solutions for large organizations.
        </p>
      </div>
      <PricingScreen />
    </>
  );
}


