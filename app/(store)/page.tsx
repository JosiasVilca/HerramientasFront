// app/(store)/page.tsx
import HeroBanner from "@/components/store/HeroBanner";
import NewArrivals from "@/components/store/NewArrivals";
import SetupBanner from "@/components/store/SetupBanner";
import FeaturesBar from "@/components/store/FeaturesBar";
import MoreProducts from "@/components/store/MoreProducts";
import Brands from "@/components/store/Brands";

export default function StoreHomePage() {
  return (
    <div className="w-full">
      <HeroBanner />
      <NewArrivals />
      <SetupBanner />
      <FeaturesBar />
      <MoreProducts />
      <Brands />
    </div>
  );
}
