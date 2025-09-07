

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProductSection />
  {/* Navigation links moved to Navbar component */}
      <footer className="mt-8 text-center text-gray-500">
        <span>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</span>
      </footer>
    </main>
  );
}

