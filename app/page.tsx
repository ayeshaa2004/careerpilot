import Navbar from "./components/shared/Navbar";
import Hero from "./components/landing/Hero";
import ProductPreview from "./components/landing/ProductPreview";
import Features from "./components/landing/Features";
import HowItWorks from "./components/landing/HowItWorks";
import CTA from "./components/landing/CTA";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProductPreview />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
