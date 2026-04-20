import { useRef, useState, useEffect } from 'react';
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

// ---------------------------------------------------------------------------
// Burn map helpers
// ---------------------------------------------------------------------------

function noise(x: number, y: number, s: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.3) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x: number, y: number, seed: number, octaves: number): number {
  let v = 0, amp = 0.5, freq = 1, total = 0;
  for (let i = 0; i < octaves; i++) {
    v += noise(x * freq, y * freq, seed + i) * amp;
    total += amp;
    amp *= 0.5;
    freq *= 2.3;
  }
  return v / total;
}

/**
 * Builds a normalised [0,1] burn map.
 * 0 = burns first (bottom-right), 1 = burns last (top-left).
 */
function buildBurnMap(W: number, H: number): Float32Array {
  const map = new Float32Array(W * H);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const fx = x / W;
      const fy = y / H;

      // Two layers of domain warping for organic ragged fire front
      const w1x = fbm(fx * 2.1,             fy * 2.1,        3,  6);
      const w1y = fbm(fx * 2.1 + 5.2,       fy * 2.1 + 1.3,  7,  6);
      const w2x = fbm(fx * 1.5 + w1x,       fy * 1.5 + w1y,  13, 5);
      const w2y = fbm(fx * 1.5 + w1x + 3.7, fy * 1.5 + w1y + 9.1, 19, 5);

      const wfx = Math.max(0, Math.min(1, fx + w2x * 0.55));
      const wfy = Math.max(0, Math.min(1, fy + w2y * 0.55));

      // Distance from bottom-right corner — fire sweeps bottom-right → top-left
      const dist = Math.sqrt((1 - wfx) * (1 - wfx) + (1 - wfy) * (1 - wfy)) / Math.SQRT2;
      map[y * W + x] = Math.max(0, Math.min(1, dist));
    }
  }

  // Normalise to full [0,1]
  let mn = 1, mx = 0;
  for (const v of map) {
    if (v < mn) mn = v;
    if (v > mx) mx = v;
  }
  const range = mx - mn || 1;
  for (let i = 0; i < map.length; i++) map[i] = (map[i] - mn) / range;

  return map;
}

/**
 * Paints the burn canvas for a given progress t ∈ [0,1].
 * t=0 → fully opaque dark paper (hides Saturn behind it)
 * t=1 → fully transparent (Saturn fully revealed)
 */
function renderBurn(
  ctx: CanvasRenderingContext2D,
  burnMap: Float32Array,
  W: number,
  H: number,
  t: number,
) {
  const out = ctx.createImageData(W, H);
  const dst = out.data;
  const EDGE = 0.055; // width of the glowing ember ring

  for (let i = 0; i < W * H; i++) {
    const bv = burnMap[i];
    const si = i * 4;

    if (bv < t - EDGE) {
      // Fully burned — transparent, Saturn image shows through
      dst[si + 3] = 0;
    } else if (bv < t) {
      // Ember / char edge
      const ep = (bv - (t - EDGE)) / EDGE; // 0 = hottest core, 1 = paper edge
      const glow = Math.pow(1 - ep, 1.2);
      dst[si]     = Math.min(255, Math.round(255 * glow + 30));
      dst[si + 1] = Math.min(255, Math.round(80 * glow * (1 - ep * 0.6)));
      dst[si + 2] = 0;
      dst[si + 3] = 255;
    } else {
      // Intact paper — opaque near-black, hides Saturn
      dst[si]     = 13;
      dst[si + 1] = 12;
      dst[si + 2] = 9;
      dst[si + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SaturnDevouringSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const imageRef      = useRef<HTMLDivElement>(null);
  const blurRef       = useRef<HTMLDivElement>(null);
  const textRef       = useRef<HTMLDivElement>(null);
  const burnCanvasRef = useRef<HTMLCanvasElement>(null);

  const burnMapRef   = useRef<Float32Array | null>(null);
  const burnReadyRef = useRef(false);

  const [modalOpen, setModalOpen] = useState(false);

  // Build burn map once on mount, rebuild on resize
  useEffect(() => {
    const canvas = burnCanvasRef.current;
    if (!canvas) return;

    const build = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (!W || !H) return;

      canvas.width  = W;
      canvas.height = H;
      burnMapRef.current = buildBurnMap(W, H);
      burnReadyRef.current = true;

      // Render at t=0: fully opaque paper so nothing leaks through on load
      const c = canvas.getContext('2d');
      if (c) renderBurn(c, burnMapRef.current, W, H, 0);
    };

    build();
    window.addEventListener('resize', build);
    return () => window.removeEventListener('resize', build);
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

      // Saturn image is always rendered — the burn canvas sits on top and hides it
      gsap.set(imageRef.current, { opacity: 1 });
      gsap.set(blurRef.current,  { opacity: 0, backdropFilter: 'blur(0px)' });
      gsap.set(textRef.current,  { opacity: 0, y: 40, filter: 'blur(10px)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=500%',
          scrub: 0.8,
        },
      });

      // Phase 1 (0%–40%): Burn canvas eats from bottom-right to top-left
      const proxy = { t: 0 };
      tl.to(proxy, {
        t: 1,
        duration: 0.4,
        ease: 'none',
        onUpdate() {
          const canvas = burnCanvasRef.current;
          if (!canvas || !burnReadyRef.current || !burnMapRef.current) return;
          const c = canvas.getContext('2d');
          if (!c) return;
          renderBurn(c, burnMapRef.current, canvas.width, canvas.height, proxy.t);
        },
      }, 0);

      // Phase 2 (40%–55%): Backdrop blur fades in
      tl.to(blurRef.current, {
        opacity: 1,
        backdropFilter: 'blur(12px)',
        duration: 0.15,
        ease: 'power2.out',
      }, 0.4);

      // Phase 3 (55%–80%): Text reveals
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.25,
        ease: 'power2.out',
      }, 0.55);

      // Phase 4 (80%–100%): Hold

      return () => { pinTrigger.kill(); };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="w-screen bg-near-black relative">
        <div ref={containerRef} className="w-full h-screen relative overflow-hidden">

          {/* Saturn image — always present, burn canvas covers it until burned away */}
          <div ref={imageRef} className="absolute inset-0 w-full h-full">
            <img
              src="/saturn.png"
              alt="Saturn Devouring His Son by Francisco Goya"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Backdrop blur — fades in after burn completes */}
          <div
            ref={blurRef}
            className="absolute inset-0 bg-near-black/40 pointer-events-none z-10"
            style={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
          />

          {/* Text content */}
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

          {/*
            Burn canvas — the key layer.
            Starts fully opaque (near-black paper), burns to transparent.
            z-30 keeps it above blur (z-10) and text (z-20) during transition;
            once t=1, it's fully transparent so text/blur are unobstructed.
          */}
          <canvas
            ref={burnCanvasRef}
            className="absolute inset-0 w-full h-full z-30 pointer-events-none"
          />

          {/* Decorative border — above everything */}
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