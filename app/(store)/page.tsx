// app/(store)/page.tsx
import HeroBanner from "@/components/store/HeroBanner";
import NewArrivals from "@/components/store/NewArrivals";
import SetupBanner from "@/components/store/SetupBanner";
import MoreProducts from "@/components/store/MoreProducts";
import Brands from "@/components/store/Brands";
import TikTokCarousel from "@/components/store/TikTokCarousel";
import FeaturesBar from "@/components/store/FeaturesBar";

export default function StoreHomePage() {
  return (
    <div className="w-full">
      <HeroBanner />
      <NewArrivals />
      <SetupBanner />
      <MoreProducts />
      <Brands />
      <TikTokCarousel />
      <FeaturesBar />
    </div>
  );
}