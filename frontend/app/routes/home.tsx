import type { Route } from "./+types/home";
import { lazy, Suspense, useState, useEffect } from 'react';
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { CuratedCollections } from "../components/CuratedCollections";
import { Stats } from "../components/Stats";
import { Footer } from "../components/Footer";

function ClientOnly({ children, fallback = null }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : <>{fallback}</>;
}

const LazyLiveAvailabilityMap = lazy(() => import("../components/LiveAvailabilityMap").then(m => ({ default: m.LiveAvailabilityMap })));

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RentX - Luxury Living, Simplified." },
    { name: "description", content: "Premium residential rentals in Dhaka's most sought-after neighborhoods." },
  ];
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CuratedCollections />
        <ClientOnly fallback={<div className="py-section-padding px-8 max-w-7xl mx-auto"><div className="w-full h-[500px] bg-slate-100 animate-pulse rounded-3xl"></div></div>}>
          <Suspense fallback={<div className="py-section-padding px-8 max-w-7xl mx-auto"><div className="w-full h-[500px] bg-slate-100 animate-pulse rounded-3xl"></div></div>}>
            <LazyLiveAvailabilityMap />
          </Suspense>
        </ClientOnly>
        <Stats />
      </main>
      <Footer />
    </>
  );
}
