import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Note: Gilroy is not available on Google Fonts, so we'll use Inter as a fallback
// and add Gilroy via CSS import
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pointnow.io"),
  title: {
    default: "PointNow - Loyalty Points Management System",
    template: "%s | PointNow",
  },
  description: "Loyalty points management for businesses and retail stores. Customers check points, merchants reward loyalty. Go live in 2 minutes. Affordable pricing for unlimited customers.",
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
  authors: [{ name: "PointNow" }],
  creator: "PointNow",
  publisher: "PointNow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pointnow.io",
    siteName: "PointNow",
    title: "PointNow - Loyalty Points Management System",
    description: "Loyalty points management for businesses and retail stores. Customers check points, merchants reward loyalty. Go live in 2 minutes. Affordable pricing for unlimited customers.",
    images: [
      {
        url: "https://www.pointnow.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "PointNow - Loyalty Points Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PointNow - Loyalty Points Management System",
    description: "Loyalty points management for businesses. Go live in 2 minutes. Affordable pricing for unlimited customers.",
    images: ["https://www.pointnow.io/og-image.png"],
    creator: "@pointnow",
  },
  robots: {
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://www.pointnow.io",
  },
  category: "business",
  verification: {
    google: "xh0kZsRv-OWIQwcOh0DWEtrtIAK6HRsOoY16XgHJnxw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
