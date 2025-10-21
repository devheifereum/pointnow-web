import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Restaurants from "@/components/Customers";
import DecorativeShapes from "@/components/DecorativeShapes";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Full page animated grid background */}
      <AnimatedGridPattern
        className="opacity-20"
        width={60}
        height={60}
        numSquares={50}
        maxOpacity={0.05}
        duration={4}
      />
      <Navbar />
      <div className="relative">
        <DecorativeShapes />
        <Hero />
      </div>
      <Restaurants />
    </div>
  );
}
