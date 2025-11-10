import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Note: Gilroy is not available on Google Fonts, so we'll use Inter as a fallback
// and add Gilroy via CSS import
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PointNow - Loyalty Points Management",
  description: "Loyalty points management for restaurants and retail stores. Customers check points, merchants reward loyalty. It's free for unlimited customers.",
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
      </body>
    </html>
  );
}
