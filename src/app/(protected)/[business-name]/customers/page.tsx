import { Suspense } from "react";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";
import CustomersScreen from "@/views/restaurants/CustomersScreen";

interface BusinessCustomersPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessCustomersPage({ params }: BusinessCustomersPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);
  
  return (
    <RestaurantLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomersScreen restaurantName={businessName} />
      </Suspense>
    </RestaurantLayout>
  );
}

