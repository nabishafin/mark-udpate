import React, { useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { ScienceSection } from './components/ScienceSection';
import { LabTesting } from './components/LabTesting';
import { OxidativeStress } from './components/OxidativeStress';
import { CellularHydration } from './components/CellularHydration';
import { OrganShowcase } from './components/OrganShowcase';
import { Products } from './components/Products';
import { Testimonials } from './components/Testimonials';
import { CTAFooter } from './components/CTAFooter';
import { OrganPanel } from './components/OrganPanel';
import { Organ } from './components/organData';
export function App() {
  const [activeOrgan, setActiveOrgan] = useState<Organ | null>(null);
  const handleSelectOrgan = (organ: Organ | null) => {
    setActiveOrgan(organ);
    if (organ) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  return (
    <div className="dark min-h-screen w-full bg-[#050608] text-white antialiased relative">
      {/* Global ambient backdrop */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[#050608]" />
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] hpe-glow-cyan opacity-25" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] hpe-glow-gold opacity-15" />
      </div>

      <Nav />

      <main>
        <Hero
          onSelectOrgan={handleSelectOrgan}
          activeId={activeOrgan?.id ?? null} />
        
        <ScienceSection />
        <LabTesting />
        <OxidativeStress />
        <CellularHydration />
        <OrganShowcase onSelectOrgan={handleSelectOrgan} />
        <Products />
        <Testimonials />
        <CTAFooter />
      </main>

      <OrganPanel
        organ={activeOrgan}
        onClose={() => setActiveOrgan(null)}
        onNavigate={handleSelectOrgan} />
      
    </div>);

}
