import RestaurantLeaderboard from "@/views/restaurants/RestaurantLeaderboard";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface RestaurantLeaderboardPageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function RestaurantLeaderboardPage({ params }: RestaurantLeaderboardPageProps) {
  const resolvedParams = await params;
  const restaurantName = decodeURIComponent(resolvedParams["restaurant-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantLeaderboard restaurantName={restaurantName} />
    </RestaurantLayout>
  );
}

