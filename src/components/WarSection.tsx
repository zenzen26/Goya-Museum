import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageModal from './ImageModal';

gsap.registerPlugin(ScrollTrigger);

const WAR_TEXT = {
  title: 'The Peninsular War',
  year: '1808 — 1814',
  lines: [
    'In 1808, Napoleon\'s invasion of Spain ushered in six years of occupation, guerrilla conflict, and atrocities that scar Goya\'s soul and transform his art forever.',
    'He witnessed the executions of May 3rd, 1808, where civilians were shot under the harsh glare of French lanterns—an event later immortalised as one of history\'s most searing anti-war images.',
    'This period culminated in The Disasters of War, a series of uncompromising etchings depicting famine, violence, and brutality without redemption or heroism.',
    'Stripped of illusion, Goya\'s work from these years confronts the darkest capacities of human nature and the fragility of civilisation itself.',
  ],
};

export default function WarSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const topImageRef = useRef<HTMLDivElement>(null);
  const bottomImageRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // Mouse parallax for images
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!topImageRef.current || !bottomImageRef.current) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(topImageRef.current.querySelector('img'), {
        x: x * 15,
        y: y * 15,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.to(bottomImageRef.current.querySelector('img'), {
        x: x * -15,
        y: y * -15,
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
        end: '+=400%',
        pin: containerRef.current,
        pinSpacing: true,
      });

      // Set initial states - images off-screen
      gsap.set(topImageRef.current, {
        x: '-100%',
      });
      gsap.set(bottomImageRef.current, {
        x: '100%',
      });
      gsap.set(blurRef.current, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
      });
      
      // Set all lines to hidden
      lineRefs.current.forEach((line) => {
        if (!line) return;
        gsap.set(line, {
          opacity: 0,
          y: 30,
          filter: 'blur(8px)',
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 0.8,
        },
      });

      // Phase 1: Both images slide in simultaneously (0% - 25%)
      tl.to(topImageRef.current, {
        x: '0%',
        duration: 0.25,
        ease: 'power2.out',
      }, 0);

      tl.to(bottomImageRef.current, {
        x: '0%',
        duration: 0.25,
        ease: 'power2.out',
      }, 0);

      // Phase 2: Hold on clear images (25% - 40%)

      // Phase 3: Backdrop blur applies to entire section (40% - 55%)
      tl.to(blurRef.current, {
        opacity: 1,
        backdropFilter: 'blur(12px)',
        duration: 0.15,
        ease: 'power2.out',
      }, 0.4);

      // Phase 4: Text lines appear one by one (50% - 90%)
      const lineDuration = 0.4 / WAR_TEXT.lines.length;
      WAR_TEXT.lines.forEach((_, index) => {
        tl.to(lineRefs.current[index], {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: lineDuration,
          ease: 'power2.out',
        }, 0.5 + (index * lineDuration));
      });

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
          {/* Top Half - Second of May - Slides from LEFT */}
          <div
            ref={topImageRef}
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden cursor-pointer group"
            onClick={() => openModal('/second-may.jpg', 'The Second of May 1808')}
            style={{ transform: 'translateX(-100%)' }}
          >
            <img
              src="/second-may.jpg"
              alt="The Second of May 1808 by Francisco Goya"
              className="w-full h-full object-cover object-center scale-110 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-near-black/0 group-hover:bg-near-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="font-label text-xs tracking-[0.2em] uppercase text-aged-gold border border-aged-gold/50 px-6 py-3">
                View Painting
              </span>
            </div>
          </div>

          {/* Bottom Half - Third of May - Slides from RIGHT */}
          <div
            ref={bottomImageRef}
            className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden cursor-pointer group"
            onClick={() => openModal('/third-may.jpg', 'The Third of May 1808')}
            style={{ transform: 'translateX(100%)' }}
          >
            <img
              src="/third-may.jpg"
              alt="The Third of May 1808 by Francisco Goya"
              className="w-full h-full object-cover object-center scale-110 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-near-black/0 group-hover:bg-near-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="font-label text-xs tracking-[0.2em] uppercase text-aged-gold border border-aged-gold/50 px-6 py-3">
                View Painting
              </span>
            </div>
          </div>

          {/* Backdrop Blur - Covers entire section */}
          <div
            ref={blurRef}
            className="absolute inset-0 bg-near-black/50 pointer-events-none z-[5]"
            style={{ backdropFilter: 'blur(0px)' }}
          />

          {/* Content Layer */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <div
              ref={textContainerRef}
              className="w-[90%] sm:w-[80%] lg:w-[70%] max-w-3xl text-center"
            >
              <span className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/60 block mb-4">
                {WAR_TEXT.year}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-aged-gold mb-12">
                {WAR_TEXT.title}
              </h2>

              {/* Text Lines - Appear one by one */}
              <div className="space-y-6 mb-12">
                {WAR_TEXT.lines.map((line, index) => (
                  <p
                    key={index}
                    ref={(el) => {
                      lineRefs.current[index] = el;
                    }}
                    className="font-body text-lg sm:text-xl lg:text-2xl text-stone-grey leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* View Buttons - Both paintings */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => openModal('/second-may.jpg', 'The Second of May 1808')}
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-aged-gold/40 hover:border-aged-gold font-label text-xs tracking-[0.2em] uppercase text-aged-gold hover:text-white hover:bg-aged-gold/10 transition-all duration-300"
                >
                  <span>Second of May</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button
                  onClick={() => openModal('/third-may.jpg', 'The Third of May 1808')}
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-aged-gold/40 hover:border-aged-gold font-label text-xs tracking-[0.2em] uppercase text-aged-gold hover:text-white hover:bg-aged-gold/10 transition-all duration-300"
                >
                  <span>Third of May</span>
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

          {/* Decorative border */}
          <div className="absolute inset-6 sm:inset-8 lg:inset-12 border border-aged-gold/20 pointer-events-none z-[10]" />
        </div>
      </section>

      {/* Modal - Shows selected image */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={modalImage}
        title={modalTitle}
      />
    </>
  );
}