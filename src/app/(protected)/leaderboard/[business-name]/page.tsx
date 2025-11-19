import LeaderboardScreen from "@/views/leaderboard/LeaderboardScreen";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";

interface LeaderboardPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export async function generateMetadata({ params }: LeaderboardPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return constructMetadata({
    title: `${businessName} - Points Leaderboard`,
    description: `View the loyalty points leaderboard for ${businessName}. Check your ranking, points, and compete with other customers.`,
    canonical: `https://pointnow.io/leaderboard/${encodeURIComponent(businessName)}`,
  });
}

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return <LeaderboardScreen restaurantName={businessName} />;
}
