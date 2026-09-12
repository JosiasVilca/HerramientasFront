// app/(store)/page.tsx
import HeroBanner from "@/components/store/HeroBanner";
import NewArrivals from "@/components/store/NewArrivals";
import SetupBanner from "@/components/store/SetupBanner";

export default function StoreHomePage() {
  return (
    <div className="w-full">
      <HeroBanner />
      <NewArrivals />
      <SetupBanner />
    </div>
  );
}
