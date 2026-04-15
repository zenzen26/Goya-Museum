import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
}

export default function ImageModal({ isOpen, onClose, imageSrc, title }: ImageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Mouse parallax effect for modal image
  useEffect(() => {
    if (!isOpen || !imageContainerRef.current || !imageRef.current) return;

    const container = imageContainerRef.current;
    const image = imageRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(image, {
        x: x * 30,
        y: y * 30,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen]);

  // Modal open/close animation with proper scroll lock cleanup
  useEffect(() => {
    if (!modalRef.current) return;

    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          // Restore scroll position
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.overflow = '';
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
          
          // Refresh ScrollTrigger to recalculate positions
          ScrollTrigger.refresh();
        },
      });
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-near-black/90 backdrop-blur-xl" />

      {/* Modal content */}
      <div
        className="relative z-10 w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-stone-grey hover:text-aged-gold transition-colors duration-300 font-label text-sm tracking-widest uppercase"
        >
          Close
        </button>

        {/* Image container with parallax */}
        <div
          ref={imageContainerRef}
          className="relative w-full h-[70vh] overflow-hidden rounded-sm"
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain scale-110"
          />
        </div>

        {/* Title */}
        <div className="mt-6 text-center">
          <h3 className="font-display text-2xl sm:text-3xl text-aged-gold">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}