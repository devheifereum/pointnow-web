import PrivacyPolicyScreen from "@/views/legal/PrivacyPolicyScreen";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy - PointNow",
  description: "Learn how PointNow protects your privacy and secures your data. We never sell your information and use industry-standard encryption.",
  canonical: "https://www.pointnow.io/privacy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description: "PointNow's Privacy Policy - How we protect and handle your data",
            url: "https://www.pointnow.io/privacy",
          }),
        }}
      />
      <div className="sr-only">
        <h1>Privacy Policy</h1>
        <p>PointNow&apos;s Privacy Policy - How we protect and handle your data</p>
      </div>
      <PrivacyPolicyScreen />
    </>
  );
}

