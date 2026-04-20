import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageModal from './ImageModal';

gsap.registerPlugin(ScrollTrigger);

interface Painting {
  id: string;
  title: string;
  year: string;
  image: string;
  description: string;
}

const PAINTINGS: Painting[] = [
  {
    id: 'saturn',
    title: 'Saturn Devouring His Son',
    year: '1819 — 1823',
    image: '/saturn.png',
    description: `In the twilight of his life, Goya painted directly onto the walls of his home—the Quinta del Sordo. These works were never meant for public eyes. They were exorcisms, visions of a mind confronting mortality, madness, and the void.

Saturn Devouring His Son stands as the most terrifying of them all. The Titan, eyes wild with frenzy, tears into the flesh of his child. There is no mythological grandeur here—only raw, animalistic horror. The brushwork is crude, violent, as if Goya attacked the plaster itself.

This is not a painting about mythology. It is a painting about time—the devourer of all things. Goya knew he was running out of time. He painted his fear, his rage, his acceptance of the inevitable.`,
  },
  {
    id: 'witches',
    title: 'Witches\' Sabbath',
    year: '1819 — 1823',
    image: '/witches.jpg',
    description: `A grotesque goat-headed figure sits enthroned, presiding over a coven of witches. The scene is lit by a sickly, unnatural light that seems to emanate from the devil himself. To Goya, this was not fantasy—it was the reality of ignorance and superstition that plagued Spain.

The figures are huddled, grotesque, their faces distorted by fanaticism. One witch holds a child aloft, an offering to the dark lord. The painting is an indictment of the Inquisition's lingering shadow, of the fear that still gripped the Spanish people even as enlightenment dawned elsewhere in Europe.

Goya saw the darkness in human nature and painted it without flinching.`,
  },
  {
    id: 'pilgrimage',
    title: 'A Pilgrimage to San Isidro',
    year: '1819 — 1823',
    image: '/pilgrimage.jpg',
    description: `A procession of gaunt, ghostly figures moves through a darkened landscape. They are pilgrims seeking miracles, but their faces show only desperation and madness. The sky churns with storm clouds that seem to press down upon the earth itself.

Goya captures the hysteria of religious fervor, the way faith can curdle into something dark and obsessive. These are not holy seekers but lost souls, wandering in a nightmare of their own making. The painting pulses with a rhythm of despair, each figure more haunted than the last.

It is a vision of Spain itself—wounded, exhausted, stumbling toward an uncertain future.`,
  },
  {
    id: 'soup',
    title: 'Two Old Men Eating Soup',
    year: '1819 — 1823',
    image: '/soup.jpg',
    description: `Two ancient faces emerge from the darkness, hunched over a bowl of soup. Their features are exaggerated, almost caricatures, yet there is profound pathos in their expressions. Hunger and age have reduced them to this—two souls sharing warmth in the void.

The painting is intimate despite its grotesque qualities. Goya shows us the reality of aging, stripped of dignity, reduced to basic needs. The darkness that surrounds them feels absolute, as if they are the last two people on earth.

In this small, devastating work, Goya confronts his own mortality with black humor and terrible clarity.`,
  },
];

export default function BentoGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bentoGridRef = useRef<HTMLDivElement>(null);
  const bentoItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const fullViewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blurRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [activePainting, setActivePainting] = useState<Painting>(PAINTINGS[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // Pin container
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=600%',
        pin: containerRef.current,
        pinSpacing: true,
        onUpdate: (self) => {
          const newIndex = Math.min(
            Math.floor(self.progress * PAINTINGS.length),
            PAINTINGS.length - 1
          );
          setActiveIndex(newIndex);
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=600%',
          scrub: 0.5,
        },
      });

      const segmentSize = 1 / PAINTINGS.length;

      // Initial states
      gsap.set(bentoGridRef.current, { opacity: 1, visibility: 'visible' });

      bentoItemRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { x: 0, y: 0, opacity: 1 });
      });

      fullViewRefs.current.forEach((el, i) => {
        if (el) {
          gsap.set(el, { 
            opacity: 0,
            scale: 1.1,
            zIndex: 5
          });
        }
      });

      blurRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0 });
      });

      textRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 50 });
      });

      // BENTO GRID SPLIT PHASE (0-20%)
      // Grid items move away in four directions
      bentoItemRefs.current.forEach((el, index) => {
        if (!el) return;

        // Determine direction based on grid position
        // 0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right
        const isLeft = index % 2 === 0;
        const isTop = index < 2;

        const moveX = isLeft ? '-100vw' : '100vw';  // Left items go left, right items go right
        const moveY = isTop ? '-100vh' : '100vh';   // Top items go up, bottom items go down

        // Move grid items away from center
        tl.to(el, {
          x: moveX,
          y: moveY,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.inOut',
        }, index * 0.02); // Slight stagger for organic feel
      });

      // Hide entire bento grid container after items move
      tl.to(bentoGridRef.current, {
        visibility: 'hidden',
        duration: 0.05,
      }, 0.2);

      // FULL VIEW PHASES for each painting
      PAINTINGS.forEach((painting, index) => {
        const startProgress = index * segmentSize;
        const fullView = fullViewRefs.current[index];
        const blurOverlay = blurRefs.current[index];
        const textContent = textRefs.current[index];

        if (!fullView) return;

        // ENTRANCE (0-30% of segment)
        // Full view fades in while scaling down slightly
        tl.to(fullView, {
          opacity: 1,
          scale: 1,
          duration: segmentSize * 0.3,
          ease: 'power2.out',
        }, startProgress);

        // BLUR (30-50% of segment)
        if (blurOverlay) {
          tl.to(blurOverlay, {
            opacity: 1,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            duration: segmentSize * 0.2,
            ease: 'power2.out',
          }, startProgress + segmentSize * 0.3);
        }

        // TEXT (50-75% of segment)
        if (textContent) {
          tl.to(textContent, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: segmentSize * 0.25,
            ease: 'power2.out',
          }, startProgress + segmentSize * 0.5);
        }

        // EXIT (75-100% of segment)
        if (index < PAINTINGS.length - 1) {
          // Fade out blur and text first
          if (blurOverlay) {
            tl.to(blurOverlay, {
              opacity: 0,
              duration: segmentSize * 0.1,
              ease: 'power2.in',
            }, startProgress + segmentSize * 0.75);
          }

          if (textContent) {
            tl.to(textContent, {
              opacity: 0,
              y: -30,
              duration: segmentSize * 0.1,
              ease: 'power2.in',
            }, startProgress + segmentSize * 0.75);
          }

          // Fade out current painting
          tl.to(fullView, {
            opacity: 0,
            scale: 1.05,
            duration: segmentSize * 0.15,
            ease: 'power2.in',
          }, startProgress + segmentSize * 0.85);
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openModal = (painting: Painting) => {
    setActivePainting(painting);
    setModalOpen(true);
  };

  return (
    <>
      <section ref={sectionRef} className="w-screen bg-near-black relative">
        <div ref={containerRef} className="w-full h-screen relative overflow-hidden">

          {/* BENTO GRID - Starting View */}
          <div 
            ref={bentoGridRef}
            className="absolute inset-0 z-10 p-6 sm:p-8 lg:p-12"
          >
            <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
              {PAINTINGS.map((painting, index) => (
                <div
                  key={painting.id}
                  ref={el => bentoItemRefs.current[index] = el}
                  className="relative overflow-hidden cursor-pointer group"
                  onClick={() => openModal(painting)}
                >
                  <img
                    src={painting.image}
                    alt={painting.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="font-label text-xs tracking-[0.2em] uppercase text-aged-gold/60 block mb-1">
                      {painting.year}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl lg:text-2xl text-aged-gold">
                      {painting.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid header */}
            <div className="absolute top-8 left-8 z-20">
              <span className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/40 block mb-2">
                The Black Paintings
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-aged-gold">
                Collection
              </h2>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60">
              <span className="font-label text-xs tracking-[0.2em] uppercase text-aged-gold">
                Scroll to explore
              </span>
              <div className="w-px h-8 bg-aged-gold/40 animate-bounce" />
            </div>
          </div>

          {/* FULL VIEWS - All use object-cover object-center */}
          {PAINTINGS.map((painting, index) => (
            <div
              key={`full-${painting.id}`}
              ref={el => fullViewRefs.current[index] = el}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ opacity: 0, zIndex: 20 + index }}
            >
              {/* Full bleed image - ALL paintings use object-cover object-center */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={painting.image}
                  alt={painting.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Backdrop blur */}
              <div
                ref={el => blurRefs.current[index] = el}
                className="absolute inset-0 bg-near-black/40 pointer-events-none z-30"
                style={{ backdropFilter: 'blur(0px)' }}
              />

              {/* Text content */}
              <div className="relative z-40 w-full h-full flex items-center pointer-events-none">
                <div
                  ref={el => textRefs.current[index] = el}
                  className="absolute right-[5%] sm:right-[8%] lg:right-[10%] w-[90%] sm:w-[45%] lg:w-[40%] max-w-xl pointer-events-auto"
                >
                  <span className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/60 block mb-4">
                    The Black Paintings • {painting.year}
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-aged-gold mb-6">
                    {painting.title}
                  </h2>
                  <div className="space-y-4 mb-8">
                    {painting.description.split('\n\n').map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="font-body text-base sm:text-lg lg:text-xl text-stone-grey leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => openModal(painting)}
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
          ))}

          {/* UI Elements */}
          <div className="absolute inset-6 sm:inset-8 lg:inset-12 border border-aged-gold/20 pointer-events-none z-50" />

          {/* Progress indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50">
            {PAINTINGS.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === activeIndex 
                    ? 'w-8 bg-aged-gold' 
                    : index < activeIndex 
                      ? 'w-4 bg-aged-gold/60' 
                      : 'w-4 bg-aged-gold/20'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-8 right-8 z-50 font-label text-xs tracking-[0.2em] uppercase text-aged-gold/60">
            <span className="text-aged-gold">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="mx-2">/</span>
            <span>{String(PAINTINGS.length).padStart(2, '0')}</span>
          </div>
        </div>
      </section>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={activePainting.image}
        title={activePainting.title}
      />
    </>
  );
}