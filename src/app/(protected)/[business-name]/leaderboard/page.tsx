import RestaurantLeaderboard from "@/views/restaurants/RestaurantLeaderboard";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface BusinessLeaderboardPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessLeaderboardPage({ params }: BusinessLeaderboardPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantLeaderboard restaurantName={businessName} />
    </RestaurantLayout>
  );
}

