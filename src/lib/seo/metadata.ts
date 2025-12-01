import type { Metadata } from "next";

const siteConfig = {
  name: "PointNow",
  description: "Loyalty points management for businesses and retail stores. Customers check points, merchants reward loyalty. Go live in 2 minutes. Affordable pricing for unlimited customers.",
  url: "https://www.pointnow.io",
  ogImage: "https://www.pointnow.io/og-image.png",
  links: {
    twitter: "https://twitter.com/pointnow",
    github: "https://github.com/pointnow",
  },
};

export function constructMetadata({
  title,
  description,
  image,
  noIndex = false,
  canonical,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
} = {}): Metadata {
  return {
    title: title
      ? {
          default: title,
          template: `%s | ${siteConfig.name}`,
        }
      : {
          default: siteConfig.name,
          template: `%s | ${siteConfig.name}`,
        },
    description: description || siteConfig.description,
    keywords: [
      "loyalty points",
      "loyalty program",
      "customer rewards",
      "points management",
      "retail loyalty",
      "business loyalty",
      "customer retention",
      "loyalty system",
      "rewards program",
      "points tracking",
      "affordable loyalty software",
      "loyalty points app",
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical || siteConfig.url,
      siteName: siteConfig.name,
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: [image || siteConfig.ogImage],
      creator: "@pointnow",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
  };
}
