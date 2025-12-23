import Billing from "@/views/restaurants/Billing";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface BusinessBillingPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessBillingPage({ params }: BusinessBillingPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return (
    <RestaurantLayout>
      <Billing restaurantName={businessName} />
    </RestaurantLayout>
  );
}


