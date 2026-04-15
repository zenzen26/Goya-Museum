import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import RiseToCourtSection from './components/RisetoCourtSection';
import WarSection from './components/WarSection';
import OtherWorksSection from './components/OtherWorksSection';
import BlackPaintingsSection from './components/BlackPaintingsSection';
import SaturnDevouringSection from './components/SaturnDevouringSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="relative">
      <HeroSection />
      <AboutSection />
      <RiseToCourtSection />
      <WarSection />
      <OtherWorksSection />
      <BlackPaintingsSection />
      <SaturnDevouringSection />
    </main>
  );
}

export default App;