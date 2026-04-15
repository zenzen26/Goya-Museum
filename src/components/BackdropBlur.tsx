import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BackdropBlurProps {
  isActive: boolean;
  intensity?: number;
  className?: string;
}

export default function BackdropBlur({ 
  isActive, 
  intensity = 12, 
  className = '' 
}: BackdropBlurProps) {
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!blurRef.current) return;

    if (isActive) {
      gsap.to(blurRef.current, {
        opacity: 1,
        backdropFilter: `blur(${intensity}px)`,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else {
      gsap.to(blurRef.current, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.in',
      });
    }
  }, [isActive, intensity]);

  return (
    <div
      ref={blurRef}
      className={`absolute inset-0 bg-near-black/30 pointer-events-none ${className}`}
      style={{ 
        opacity: 0, 
        backdropFilter: 'blur(0px)',
        WebkitBackdropFilter: 'blur(0px)',
      }}
    />
  );
}