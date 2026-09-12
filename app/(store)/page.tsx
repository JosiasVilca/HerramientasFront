// app/(store)/page.tsx
import HeroBanner from "@/components/store/HeroBanner";
import NewArrivals from "@/components/store/NewArrivals";

export default function StoreHomePage() {
  return (
    <div className="w-full">
      <HeroBanner />
      <NewArrivals />
    </div>
  );
}