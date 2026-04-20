import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GoyaFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-screen bg-near-black relative overflow-hidden"
    >
      {/* Top decorative line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-aged-gold/30 to-transparent" />

      <div ref={contentRef} className="relative z-10 px-6 sm:px-8 lg:px-12 py-20 sm:py-24 lg:py-32">
        {/* Main quote */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl text-aged-gold/80 leading-relaxed italic">
            "Fantasy abandoned by reason produces impossible monsters;
            united with her, she is the mother of the arts"
          </blockquote>
          <cite className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/40 mt-6 block not-italic">
            — Francisco de Goya, Los Caprichos
          </cite>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-aged-gold/20 mx-auto mb-16 sm:mb-20" />

        {/* Museum info grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 mb-16 sm:mb-20">
          {/* Visit */}
          <div className="text-center sm:text-left">
            <h4 className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/40 mb-4">
              Visit
            </h4>
            <p className="font-body text-stone-grey leading-relaxed">
              Museo del Prado
              <br />
              Paseo del Prado, s/n
              <br />
              28014 Madrid, Spain
            </p>
          </div>

          {/* Hours */}
          <div className="text-center">
            <h4 className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/40 mb-4">
              Hours
            </h4>
            <p className="font-body text-stone-grey leading-relaxed">
              Monday — Saturday
              <br />
              10:00 — 20:00
              <br />
              Sunday 10:00 — 19:00
            </p>
          </div>

          {/* Connect - Real social links */}
          <div className="text-center sm:text-right">
            <h4 className="font-label text-xs tracking-[0.3em] uppercase text-aged-gold/40 mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.linkedin.com/in/zi-en-tham-605a40161/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-stone-grey hover:text-aged-gold transition-colors duration-300"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/zenzen26"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-stone-grey hover:text-aged-gold transition-colors duration-300"
              >
                GitHub
              </a>
              <a
                href="https://my-portfolio-rouge-omega-93.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-stone-grey hover:text-aged-gold transition-colors duration-300"
              >
                Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Large decorative text */}
        <div className="overflow-hidden mb-12">
          <div className="font-display text-[8vw] sm:text-[6vw] lg:text-[4vw] text-aged-gold/[0.03] text-center whitespace-nowrap select-none">
            FRANCISCO DE GOYA Y LUCIENTES
          </div>
           <p className="place-self-center text-center font-body max-w-6xl text-sm text-aged-gold/[0.2] leading-relaxed">
                The Museo del Prado exhibition details presented here are fictional and created solely 
                for showcasing.
            </p>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-aged-gold/10">
          <p className="font-label text-[10px] tracking-[0.2em] uppercase text-aged-gold/30">
            © 2026 Digital Experience
          </p>
          <p className="font-label text-[10px] tracking-[0.2em] uppercase text-aged-gold/30">
            Crafted by Zen
          </p>
        </div>
      </div>

      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.02]" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }}
      />
    </footer>
  );
}