import { useRef, useEffect, useCallback } from 'react';
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
  const scrollYRef = useRef<number>(0);

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

  // Handle scroll lock without breaking ScrollTrigger
  useEffect(() => {
    if (!isOpen) return;

    // Store current scroll position BEFORE any changes
    scrollYRef.current = window.scrollY;

    // Get the scroll container that ScrollTrigger uses (usually document.body or html)
    const html = document.documentElement;
    const body = document.body;

    // Store original styles
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyWidth = body.style.width;
    const originalBodyTop = body.style.top;

    // Lock scroll by hiding overflow on both html and body
    // This prevents scroll without changing position/fixed which breaks ScrollTrigger
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    // Prevent touch scrolling on mobile
    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    // Animate modal in
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }

    return () => {
      // Remove touch listener
      document.removeEventListener('touchmove', preventTouchMove);

      // Restore original styles
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      body.style.position = originalBodyPosition;
      body.style.width = originalBodyWidth;
      body.style.top = originalBodyTop;
    };
  }, [isOpen]);

  // Handle close with proper cleanup
  const handleClose = useCallback(() => {
    if (!modalRef.current) {
      onClose();
      return;
    }

    // Animate out first
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        // Store scroll position to restore
        const scrollPos = scrollYRef.current;

        // Call onClose to unmount the modal
        onClose();

        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          // Restore scroll position
          window.scrollTo(0, scrollPos);

          // Refresh ScrollTrigger after a brief delay to ensure layout is stable
          requestAnimationFrame(() => {
            ScrollTrigger.refresh(true);
          });
        });
      },
    });
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
      onClick={handleClose}
      style={{ opacity: 0 }}
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
          onClick={handleClose}
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