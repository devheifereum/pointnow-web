import MessageBlasting from "@/views/restaurants/MessageBlasting";
import RestaurantLayout from "@/components/restaurant/RestaurantLayout";

interface BusinessMessageBlastingPageProps {
  params: Promise<{
    "business-name": string;
  }>;
}

export default async function BusinessMessageBlastingPage({
  params,
}: BusinessMessageBlastingPageProps) {
  const resolvedParams = await params;
  const businessName = decodeURIComponent(resolvedParams["business-name"]);

  return (
    <RestaurantLayout>
      <MessageBlasting restaurantName={businessName} />
    </RestaurantLayout>
  );
}






