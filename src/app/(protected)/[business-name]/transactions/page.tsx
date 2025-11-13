import RestaurantTransactions from "@/views/restaurants/RestaurantTransactions";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface BusinessTransactionsPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessTransactionsPage({ params }: BusinessTransactionsPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return (
    <RestaurantLayout>
      <RestaurantTransactions restaurantName={businessName} />
    </RestaurantLayout>
  );
}

