import ConsultSection from "@modules/home/components/consult-section";
import Hero from "@modules/home/components/hero";
import PlatformFeatures from "@modules/home/components/platform-features";
import ProductGrid from "@modules/home/components/product-grid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <PlatformFeatures />
      <ConsultSection />
    </>
  );
}
