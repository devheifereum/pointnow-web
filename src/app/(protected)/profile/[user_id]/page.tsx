import UserProfileScreen from "@/views/profile/UserProfileScreen";

interface UserProfilePageProps {
  params: Promise<{
    "user_id": string;
  }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = await params;
  const userId = resolvedParams["user_id"];
  
  return <UserProfileScreen userId={userId} />;
}

