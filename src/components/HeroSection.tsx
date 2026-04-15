import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onComplete?: () => void;
}

export default function HeroSection({ onComplete }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const datesRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      tl.fromTo(
        nameRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 }
      )
        .fromTo(
          datesRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.6'
        )
        .fromTo(
          quoteRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.5'
        );

      // Scroll-triggered exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.8,
          onLeave: () => onComplete?.(),
          onEnterBack: () => {
            gsap.to(contentRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.5
            });
          }
        }
      });

      scrollTl.to(contentRef.current, {
        opacity: 0,
        y: -80,
        scale: 0.95,
        ease: 'power2.in'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
        ref={sectionRef}
        className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-near-black
                before:content-[''] before:absolute before:inset-0 
                before:bg-[url('/hero.png')] before:bg-cover before:bg-center 
                before:blur-sm"
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div
        ref={contentRef}
        className="w-[90%] sm:w-[80%] lg:w-[70%] text-center flex flex-col items-center justify-center"
      >
        
        {/* Name */}
        <div className="mb-6">
          <p className="font-label text-sm sm:text-base tracking-[0.3em] uppercase text-stone-grey mb-3">
            Francisco José de
          </p>
          <h1
            ref={nameRef}
            className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-aged-gold tracking-[1.5rem] leading-none uppercase"
          >
            Goya
          </h1>
        </div>

        {/* Dates */}
        <p
          ref={datesRef}
          className="font-body text-xl sm:text-2xl lg:text-3xl text-olive-grey tracking-widest mb-12"
        >
          1746 — 1828
        </p>

        {/* Quote */}
        <div ref={quoteRef} className="max-w-2xl">
          <blockquote className="font-body text-lg sm:text-xl lg:text-2xl text-stone-grey italic leading-relaxed mb-4">
            "The sleep of reason produces monsters."
          </blockquote>
          <cite className="font-label text-xs sm:text-sm tracking-[0.2em] uppercase text-stone-grey/60 not-italic">
            — Los Caprichos, 1799
          </cite>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="font-label text-[10px] tracking-[0.3em] uppercase text-stone-grey">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-stone-grey to-transparent" />
      </div>
    </section>
  );
}