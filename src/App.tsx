import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import RiseToCourtSection from './components/RisetoCourtSection';
import WarSection from './components/WarSection';
import OtherWorksSection from './components/OtherWorksSection';
import BlackPaintingsSection from './components/BlackPaintingsSection';
import BentoGallery from './components/BentoGallery';
import GrainOverlay from './components/GrainOverlay';
import BackgroundMusic from './components/BackgroundMusic';
import GoyaFooter from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative bg-near-black min-h-screen">
      <GrainOverlay />
      <BackgroundMusic />

      <main className="relative">
        <HeroSection />
        <AboutSection />
        <RiseToCourtSection />
        <WarSection />
        <OtherWorksSection />
        <BlackPaintingsSection />
        <BentoGallery />
        <GoyaFooter />
      </main>
    </div>
  );
}

export default App;