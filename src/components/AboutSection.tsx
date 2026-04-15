import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  'Born in 1746 in Fuendetodos, Aragon, Francisco Goya became the leading Spanish artist of his era, rising swiftly through the royal court with luminous Rococo works.',
  'After a severe illness in 1792 left him deaf, his practice turned inward, revealing a darker, more critical vision of society—its violence, its hypocrisies, and its disquieting truths.',
  'Straddling two eras, he stands as both the last Old Master and the first modern artist.',
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Pin the entire section while scrolling through lines
      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * (LINES.length * 0.8)}`,
        pin: containerRef.current,
        pinSpacing: true,
      });

      // Set all lines to hidden initially
      lineRefs.current.forEach((line) => {
        if (!line) return;
        gsap.set(line, {
          opacity: 0,
          y: 40,
          filter: 'blur(8px)',
        });
      });

      // Create scroll-triggered animations for each line
      lineRefs.current.forEach((line, index) => {
        if (!line) return;

        const startOffset = index * (100 / LINES.length);

        // Animate line in
        gsap.to(line, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${startOffset}% top`,
            end: `${startOffset + 10}% top`,
            scrub: 0.3,
            toggleActions: 'play reverse play reverse',
          },
        });
      });

      return () => {
        scrollTriggerInstance.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-screen bg-near-black relative"
    >
      <div
        ref={containerRef}
        className="w-full h-screen flex flex-col lg:flex-row"
      >
        {/* Left Column - Image */}
        <div
          ref={imageRef}
          className="w-full lg:w-1/2 h-[40vh] lg:h-full relative overflow-hidden"
        >
          <img
            src="/artist.jpg"
            alt="Francisco Goya"
            className="w-full h-full object-cover object-center contrast-125 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-near-black/40" />
          <div className="absolute inset-4 border border-aged-gold/20 pointer-events-none hidden lg:block" />
        </div>

        {/* Right Column - Text Content (Vertically Centered) */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-full flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
          <div
            ref={textWrapperRef}
            className="w-[90%] sm:w-[80%] lg:w-[85%] xl:w-[75%] max-w-2xl"
          >
            {/* Header */}
            <div className="mb-8 lg:mb-12">
              <span className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/60 block mb-2">
                Biography
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-aged-gold">
                The Artist
              </h2>
            </div>

            {/* Lines - Each reveals one by one on scroll */}
            <div className="space-y-6 lg:space-y-8">
              {LINES.map((line, index) => (
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

            {/* Footer decoration */}
            <div className="mt-10 lg:mt-12 flex items-center gap-4">
              <div className="w-12 h-px bg-aged-gold/40" />
              <span className="font-label text-xs tracking-[0.2em] uppercase text-stone-grey/40">
                1746 — 1828
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}