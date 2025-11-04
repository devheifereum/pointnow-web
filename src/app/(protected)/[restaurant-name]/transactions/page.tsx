import RestaurantTransactions from "@/views/restaurants/RestaurantTransactions";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface RestaurantTransactionsPageProps {
  params: Promise<{
    "restaurant-name": string;
  }>;
}

export default async function RestaurantTransactionsPage({ params }: RestaurantTransactionsPageProps) {
  const resolvedParams = await params;
  const restaurantName = decodeURIComponent(resolvedParams["restaurant-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantTransactions restaurantName={restaurantName} />
    </RestaurantLayout>
  );
}

