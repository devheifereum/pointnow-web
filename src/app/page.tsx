import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect to the protected home page for logged-in users
  // In a real app, you'd check authentication status here
  redirect("/home");
}
