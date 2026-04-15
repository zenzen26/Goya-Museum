import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageModal from './ImageModal';

gsap.registerPlugin(ScrollTrigger);

const SATURN_TEXT = {
  title: 'Saturn Devouring His Son',
  year: '1819 — 1823',
  description: `In the twilight of his life, Goya painted directly onto the walls of his home—the Quinta del Sordo. These works were never meant for public eyes. They were exorcisms, visions of a mind confronting mortality, madness, and the void.

Saturn Devouring His Son stands as the most terrifying of them all. The Titan, eyes wild with frenzy, tears into the flesh of his child. There is no mythological grandeur here—only raw, animalistic horror. The brushwork is crude, violent, as if Goya attacked the plaster itself.

This is not a painting about mythology. It is a painting about time—the devourer of all things. Goya knew he was running out of time. He painted his fear, his rage, his acceptance of the inevitable. The Black Paintings are not decorations; they are confessions scratched into the walls of a deaf man's isolation.`,
};

export default function SaturnDevouringSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const burnRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [modalOpen, setModalOpen] = useState(false);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const pinTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%',
        pin: containerRef.current,
        pinSpacing: true,
      });

      // Set initial states
      gsap.set(burnRef.current, {
        opacity: 1,
        scale: 1.5,
        filter: 'blur(0px) contrast(200%) brightness(200%)',
      });
      gsap.set(imageRef.current, {
        opacity: 0,
        scale: 1.2,
      });
      gsap.set(blurRef.current, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
      });
      gsap.set(textRef.current, {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 0.8,
        },
      });

      // Phase 1: Burn transition effect (0% - 30%)
      // Simulates burning edge reveal with distortion
      tl.to(burnRef.current, {
        opacity: 0,
        scale: 2,
        filter: 'blur(30px) contrast(500%) brightness(300%)',
        duration: 0.3,
        ease: 'power2.in',
      }, 0);

      // Phase 2: Saturn image reveals (10% - 40%)
      tl.to(imageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, 0.1);

      // Phase 3: Hold on clear image (40% - 60%)

      // Phase 4: Backdrop blur applies (60% - 75%)
      tl.to(blurRef.current, {
        opacity: 1,
        backdropFilter: 'blur(12px)',
        duration: 0.15,
        ease: 'power2.out',
      }, 0.6);

      // Phase 5: Text appears (70% - 90%)
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.2,
        ease: 'power2.out',
      }, 0.7);

      return () => {
        pinTrigger.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="w-screen bg-near-black relative">
        <div
          ref={containerRef}
          className="w-full h-screen relative overflow-hidden"
        >
          {/* Burn Effect Overlay - Creates the transition from Black Paintings */}
          <div
            ref={burnRef}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, #ff4400 0%, #ff0000 30%, #000000 70%)',
              mixBlendMode: 'color-dodge',
            }}
          />

          {/* Saturn Image - Object cover top center */}
          <div
            ref={imageRef}
            className="absolute inset-0 w-full h-full opacity-0"
          >
            <img
              src="/saturn.png"
              alt="Saturn Devouring His Son by Francisco Goya"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Backdrop Blur Overlay */}
          <div
            ref={blurRef}
            className="absolute inset-0 bg-near-black/40 pointer-events-none z-10"
            style={{ backdropFilter: 'blur(0px)' }}
          />

          {/* Content Layer */}
          <div className="relative z-20 w-full h-full flex items-center">
            <div
              ref={textRef}
              className="absolute right-[5%] sm:right-[8%] lg:right-[10%] w-[90%] sm:w-[45%] lg:w-[40%] max-w-xl"
            >
              <span className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/60 block mb-4">
                The Black Paintings • {SATURN_TEXT.year}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-aged-gold mb-6">
                {SATURN_TEXT.title}
              </h2>
              <div className="space-y-4 mb-8">
                {SATURN_TEXT.description.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-body text-base sm:text-lg lg:text-xl text-stone-grey leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="group flex items-center gap-3 font-label text-xs tracking-[0.2em] uppercase text-aged-gold hover:text-white transition-colors duration-300"
              >
                <span>View Painting</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Decorative border */}
          <div className="absolute inset-6 sm:inset-8 lg:inset-12 border border-aged-gold/20 pointer-events-none z-40" />
        </div>
      </section>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc="/saturn.png"
        title={SATURN_TEXT.title}
      />
    </>
  );
}