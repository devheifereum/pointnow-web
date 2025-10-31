import LeaderboardScreen from "@/views/leaderboard/LeaderboardScreen";

interface LeaderboardPageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const resolvedParams = await params;
  const restaurantName = decodeURIComponent(resolvedParams["restaurant-name"]);
  
  return <LeaderboardScreen restaurantName={restaurantName} />;
}
