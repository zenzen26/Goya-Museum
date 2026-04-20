import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageModal from './ImageModal';

gsap.registerPlugin(ScrollTrigger);

const DON_LUIS_TEXT = {
  title: 'Don Luis de Borbón',
  year: '1783',
  description: `In 1783, Goya received his first major royal commission from Don Luis de Borbón, marking his emergence from provincial obscurity into the orbit of the Spanish court. \n
                The portrait reveals his early command of psychological presence, capturing aristocratic ease while subtly exposing the individual beneath the rank. Its vitality and refinement quickly established his reputation among Spain’s elite, opening enduring access to royal patronage.`
};

const CHARLES_TEXT = {
  title: 'Charles IV and His Family',
  year: '1800',
  description: `By 1800, Goya had reached the height of his career as court painter to Charles IV. His group portrait of the royal family is both official homage and quiet critique of power and human frailty.

The King and Queen occupy the centre, yet Goya’s realism exposes tension beneath ceremony and inherited imperfection within the dynasty. While fulfilling the demands of royal portraiture, he subtly undermines its idealisation.

The work anticipates a world on the brink of upheaval, as Goya begins to look beyond the court toward the instability that would soon reshape Spain.`,
};

export default function RiseToCourtSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const donLuisWrapperRef = useRef<HTMLDivElement>(null);
  const charlesImageRef = useRef<HTMLDivElement>(null);
  const donLuisTextRef = useRef<HTMLDivElement>(null);
  const charlesTextRef = useRef<HTMLDivElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // Mouse parallax for background images
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!donLuisWrapperRef.current || !charlesImageRef.current) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(donLuisWrapperRef.current.querySelector('img'), {
        x: x * 20,
        y: y * 20,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.to(charlesImageRef.current.querySelector('img'), {
        x: x * 20,
        y: y * 20,
        duration: 1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const pinTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=500%',
        pin: containerRef.current,
        pinSpacing: true,
      });

      // Set initial states
      gsap.set(charlesImageRef.current, {
        clipPath: 'inset(0 100% 0 0)',
      });
      gsap.set(donLuisWrapperRef.current, {
        clipPath: 'inset(0 0% 0 0)',
      });
      gsap.set(donLuisTextRef.current, {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)',
      });
      gsap.set(charlesTextRef.current, {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)',
      });
    


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=500%',
          scrub: 0.8,
        },
      });

      gsap.set('.don-luis-blur', { opacity: 0 });

    // Phase 1: Backdrop blur on Don Luis (0% - 15%)
    tl.to('.don-luis-blur', {
        opacity: 1, // Animate the BLUR LAYER only
        duration: 0.15,
        ease: 'power2.out',
    }, 0);

      // Phase 2: Don Luis text appears (10% - 25%)
      tl.to(donLuisTextRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.15,
        ease: 'power2.out',
      }, 0.1);

      // Phase 3: Transition Mask (25% - 60%)
      // Both Don Luis wrapper and Charles image use same clip-path animation
      // This means as Charles reveals from left, Don Luis (with blur) hides to left
      
      // Charles reveals from left
      tl.to(charlesImageRef.current, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.35,
        ease: 'none',
      }, 0.25);

      // Don Luis wrapper (with blur and text) gets clipped away to the left
      tl.to(donLuisWrapperRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.25,
        ease: 'none',
      }, 0.25);

      // Phase 4: Hold on Charles clear image (60% - 70%)

      // Phase 5: Backdrop blur on Charles (70% - 85%)
      // We need a separate blur layer for Charles
      tl.to('.charles-blur', {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out',
      }, 0.7);

      // Phase 6: Charles text appears (80% - 95%)
      tl.to(charlesTextRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.15,
        ease: 'power2.out',
      }, 0.8);

      return () => {
        pinTrigger.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openModal = (imageSrc: string, title: string) => {
    setModalImage(imageSrc);
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <>
      <section ref={sectionRef} className="w-screen bg-near-black relative">
        <div ref={containerRef} className="w-full h-screen relative overflow-hidden">
          {/* Don Luis Wrapper - Contains image, blur, and text */}
          {/* This entire wrapper gets clipped during transition */}
          <div
            ref={donLuisWrapperRef}
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: 'inset(0 0% 0 0)' }}
          >
            {/* Don Luis Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src="don-luis.jpg"
                alt="Don Luis de Borbón by Francisco Goya"
                className="w-full h-full object-cover object-center scale-110"
              />
            </div>
            
            {/* Backdrop Blur - Inside wrapper so it gets clipped too */}
            <div 
              className="don-luis-blur absolute inset-0 bg-near-black/40 pointer-events-none"
              style={{ backdropFilter: 'blur(12px)', opacity: 0 }}
            />

            {/* Don Luis Text - Inside wrapper so it gets clipped too */}
            <div className="absolute inset-0 flex items-center z-10">
              <div
                ref={donLuisTextRef}
                className="absolute left-[5%] sm:left-[8%] lg:left-[10%] w-[90%] sm:w-[45%] lg:w-[40%] max-w-xl"
              >
                <span className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/60 block mb-4">
                  Rise to Court • {DON_LUIS_TEXT.year}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-aged-gold mb-6">
                  {DON_LUIS_TEXT.title}
                </h2>
                <div className="space-y-4 mb-8">
                  {DON_LUIS_TEXT.description.split('\n\n').map((paragraph, index) => (
                    <p
                      key={index}
                      className="font-body text-base sm:text-lg lg:text-xl text-stone-grey leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => openModal('don-luis.jpg', DON_LUIS_TEXT.title)}
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
          </div>

          {/* Charles Image - Reveals from left, always clear */}
          <div
            ref={charlesImageRef}
            className="absolute inset-0 w-full h-full overflow-hidden z-[1]"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            <img
              src="charles.jpg"
              alt="Charles IV and His Family by Francisco Goya"
              className="w-full h-full object-cover object-center scale-110"
            />
          </div>

          {/* Charles Blur Layer - Separate from image, fades in after transition */}
          <div 
            className="charles-blur absolute inset-0 bg-near-black/40 pointer-events-none z-[2] opacity-0"
            style={{ backdropFilter: 'blur(12px)' }}
          />

          {/* Charles Text - Outside wrapper, appears after blur */}
          <div className="absolute inset-0 flex items-center z-[3] pointer-events-none">
            <div
              ref={charlesTextRef}
              className="absolute right-[5%] sm:right-[8%] lg:right-[10%] w-[90%] sm:w-[45%] lg:w-[40%] max-w-xl pointer-events-auto"
            >
              <span className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/60 block mb-4">
                The Royal Court • {CHARLES_TEXT.year}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-aged-gold mb-6">
                {CHARLES_TEXT.title}
              </h2>
              <div className="space-y-4 mb-8">
                {CHARLES_TEXT.description.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-body text-base sm:text-lg lg:text-xl text-stone-grey leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <button
                onClick={() => openModal('charles.jpg', CHARLES_TEXT.title)}
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
          <div className="absolute inset-6 sm:inset-8 lg:inset-12 border border-aged-gold/20 pointer-events-none z-[10]" />
        </div>
      </section>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={modalImage}
        title={modalTitle}
      />
    </>
  );
}