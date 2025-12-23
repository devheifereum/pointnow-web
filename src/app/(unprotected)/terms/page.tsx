import TermsOfServiceScreen from "@/views/legal/TermsOfServiceScreen";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service - PointNow",
  description: "Read PointNow's Terms of Service. Understand your rights and responsibilities when using our loyalty platform.",
  canonical: "https://www.pointnow.io/terms",
});

export default function TermsOfServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            description: "PointNow's Terms of Service - Your rights and responsibilities",
            url: "https://www.pointnow.io/terms",
          }),
        }}
      />
      <div className="sr-only">
        <h1>Terms of Service</h1>
        <p>PointNow's Terms of Service - Your rights and responsibilities</p>
      </div>
      <TermsOfServiceScreen />
    </>
  );
}

