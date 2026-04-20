import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageModal from './ImageModal';

gsap.registerPlugin(ScrollTrigger);

const WORKS = [
  {
    id: 1,
    image: '/other-work-1.jpg',
    title: 'A heroic feat! With dead men!',
    description: 'Mutilated bodies are shown against a backdrop barren landscape',
  },
  {
    id: 2,
    image: '/other-work-2.jpg',
    title: 'This is bad',
    description: 'A monk is killed by French soldiers looting church treasures.',
  },
  {
    id: 3,
    image: '/other-work-3.jpg',
    title: 'Cartloads for the cemetery',
    description: 'The last print in the famine group.',
  },
  {
    id: 4,
    image: '/other-work-4.jpg',
    title: 'There is no one to help them',
    description: 'On a hillside, three women lie dead and a lone figure weeps in mournful grief.',
  },
];

export default function OtherWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const gallery = galleryRef.current;
      if (!gallery) return;

      // Calculate total scroll distance
      const totalWidth = gallery.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth;

      // Pin the section and animate horizontal scroll
      gsap.to(gallery, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          pin: containerRef.current,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate cards coming in from right
      const cards = gallery.querySelectorAll('.work-card');
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            x: 800,
            opacity: 0,
            rotateY: 15,
          },
          {
            x: 0,
            opacity: 1,
            rotateY: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `top+=${index * 300} top`,
              end: () => `top+=${(index + 1) * 300} top`,
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openModal = (imageSrc: string, title: string) => {
    // You can implement modal opening here
    console.log('Open modal:', imageSrc, title);
  };

  return (
    <section
      ref={sectionRef}
      className="w-screen bg-near-black relative"
    >
      <div
        ref={containerRef}
        className="w-full h-screen relative overflow-hidden"
      >
        {/* Background Title - Stays behind everything */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0"
        >
          <h2 className="font-display text-[15vw] sm:text-[12vw] lg:text-[10vw] text-aged-gold/10 leading-none tracking-tight">
            Other Works
          </h2>
          <p className="font-body text-xl sm:text-2xl lg:text-3xl text-stone-grey/30 mt-4 text-center max-w-2xl px-4">
            The Disasters of War is a series of 82 prints created by Francisco Goya between 1810 and 1820.</p>
        </div>

        {/* Horizontal Gallery */}
        <div
          ref={galleryRef}
          className="absolute top-0 left-0 h-full flex items-center gap-8 pl-[10vw] pr-[50vw] z-10"
        >
          {WORKS.map((work, index) => (
            <div
              key={work.id}
              className="work-card relative flex-shrink-0 w-[70vw] sm:w-[50vw] lg:w-[35vw] h-[70vh] group cursor-pointer"
            >
              {/* Card Image */}
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover object-center group-hover:grayscale transition-all duration-700 scale-110 group-hover:scale-100"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-near-black/0 group-hover:bg-near-black/60 transition-all duration-500 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                  <p className="font-body text-lg sm:text-xl text-stone-grey text-center px-8 mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    {work.description}
                  </p>
                  <button
                    onClick={() => openModal(work.image, work.title)}
                    className="group/btn flex items-center gap-2 font-label text-xs tracking-[0.2em] uppercase text-aged-gold hover:text-white transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200"
                  >
                    <span>View</span>
                    <svg
                      className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card Number */}
              <div className="absolute -bottom-8 left-0 font-label text-xs tracking-[0.3em] uppercase text-stone-grey/40">
                0{index + 1} / 0{WORKS.length}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative border */}
        <div className="absolute inset-6 sm:inset-8 lg:inset-12 border border-aged-gold/20 pointer-events-none z-20" />
      </div>
    </section>
  );
}