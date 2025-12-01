import PricingScreen from "@/views/pricing/PricingScreen";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Pricing - Affordable Plans for Every Business",
  description: "Simple, transparent pricing for loyalty programs. Choose the perfect plan for your business. Start your loyalty program today.",
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
            description: "Simple, transparent pricing for loyalty programs. Choose the perfect plan for your business.",
            url: "https://www.pointnow.io/pricing",
            mainEntity: {
              "@type": "Offer",
              name: "Professional Plan",
              price: "73",
              priceCurrency: "USD",
              description: "Affordable pricing for unlimited customers",
            },
          }),
        }}
      />
      {/* Initial content visible to Googlebot */}
      <div className="sr-only">
        <h1>Pricing - Affordable Plans for Every Business</h1>
        <p>
          Simple, transparent pricing for loyalty programs. Choose the perfect plan for your business. Start your loyalty program today.
        </p>
        <p>
          Our pricing plans include professional plans for growing businesses and enterprise solutions for large organizations, all with unlimited customers.
        </p>
      </div>
      <PricingScreen />
    </>
  );
}


