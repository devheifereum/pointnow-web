import LeaderboardScreen from "@/views/leaderboard/LeaderboardScreen";

interface LeaderboardPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return <LeaderboardScreen restaurantName={businessName} />;
}
