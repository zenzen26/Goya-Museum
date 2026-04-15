import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BlackPaintingsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const pinTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=200%',
        pin: containerRef.current,
        pinSpacing: true,
      });

      // Set initial states
      gsap.set(titleRef.current, {
        opacity: 0,
        scale: 1.5,
        filter: 'blur(20px)',
      });
      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 30,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 0.8,
        },
      });

      // Phase 1: Title appears from blur and scales down (0% - 40%)
      tl.to(titleRef.current, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.4,
        ease: 'power2.out',
      }, 0);

      // Phase 2: Subtitle fades in (30% - 50%)
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: 'power2.out',
      }, 0.3);

      // Phase 3: Hold (50% - 100%)

      return () => {
        pinTrigger.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-screen bg-near-black relative">
      <div
        ref={containerRef}
        className="w-full h-screen relative overflow-hidden flex items-center justify-center"
      >
        {/* Background Image - Visible through text mask */}
        <div
          ref={imageRef}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="/black-painting.jpg"
            alt="Black Paintings by Francisco Goya"
            className="w-full h-full object-cover object-center grayscale brightness-50 scale-110"
          />
        </div>

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-near-black/40" />

        {/* Text Mask Container - Uses mix-blend-mode to reveal image through text */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          {/* Main Title - Acts as mask */}
          <div
            ref={titleRef}
            className="relative"
            style={{ mixBlendMode: 'difference' }}
          >
            <h2 className="font-display text-[12vw] sm:text-[10vw] lg:text-[8vw] text-white leading-none tracking-tight">
              The Black
              <br />
              Paintings
            </h2>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="font-body text-xl sm:text-2xl lg:text-3xl text-stone-grey mt-8 max-w-2xl italic"
          >
            "Fantasy abandoned by reason produces impossible monsters"
          </p>
        </div>

        {/* Decorative border */}
        <div className="absolute inset-6 sm:inset-8 lg:inset-12 border border-aged-gold/20 pointer-events-none" />
      </div>
    </section>
  );
}