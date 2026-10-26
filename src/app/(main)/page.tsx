import Hero from "@/components/sections/Hero";
import TechMarquee from "@/components/sections/TechMarquee";
import FeaturedWork from "@/components/sections/FeaturedWork";
import Explore from "@/components/sections/Explore";
import Terminal from "@/components/sections/Terminal";

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <FeaturedWork />
      <Explore />
      <Terminal />
    </>
  );
}
