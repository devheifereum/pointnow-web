import AboutScreen from "@/views/about/AboutScreen";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "About Us - Our Story",
  description: "Learn about PointNow's mission to make loyalty points the new asset class. From customers to stakeholders, we're building the future of loyalty.",
  canonical: "https://www.pointnow.io/about",
});

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About PointNow",
            description: "Learn about PointNow's mission to make loyalty points the new asset class.",
            url: "https://www.pointnow.io/about",
          }),
        }}
      />
      <div className="sr-only">
        <h1>About PointNow</h1>
        <p>Learn about our mission to make loyalty points the new asset class.</p>
      </div>
      <AboutScreen />
    </>
  );
}

