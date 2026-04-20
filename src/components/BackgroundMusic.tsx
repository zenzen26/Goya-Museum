import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.loop = true;

    audio.play()
      .then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      })
      .catch(() => {
        setIsPlaying(false);
        setIsMuted(true);
        setShowToast(true);
      });
  }, []);

  useEffect(() => {
    if (showToast && toastRef.current) {
      gsap.fromTo(toastRef.current, 
        { y: 15, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );

      const timer = setTimeout(() => hideToast(), 1500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const hideToast = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, { 
        opacity: 0, y: 10, duration: 0.6, ease: "power3.in",
        onComplete: () => setShowToast(false) 
      });
    }
  };

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
      audio.play().then(() => {
        setIsPlaying(true);
        if (showToast) hideToast();
      }).catch(() => {});
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, showToast]);

  return (
    <>
      <audio ref={audioRef} src="ambient.mp3" preload="auto" muted={isMuted} />

      <div className="fixed top-6 right-6 z-[9998] flex flex-col items-end gap-3">
        {/* Mute Toggle Button */}
        <button
          onClick={toggleMute}
          className="group flex items-center gap-2 px-4 py-2 
                     bg-near-black/60 backdrop-blur-sm border border-aged-gold/20 
                     rounded-full hover:border-aged-gold/50 transition-all duration-300
                     font-label text-xs tracking-[0.2em] uppercase text-aged-gold/70 
                     hover:text-aged-gold"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {!isMuted && isPlaying && (
            <span className="flex items-center gap-0.5 mr-1">
              <span className="w-0.5 h-2 bg-aged-gold/60 animate-[soundbar_0.5s_ease-in-out_infinite]" />
              <span className="w-0.5 h-3 bg-aged-gold/60 animate-[soundbar_0.7s_ease-in-out_infinite_0.1s]" />
              <span className="w-0.5 h-1.5 bg-aged-gold/60 animate-[soundbar_0.6s_ease-in-out_infinite_0.2s]" />
            </span>
          )}

          {/* Restored Original Icons */}
          {isMuted ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        {/* 3-Second Toast */}
        {showToast && (
          <div 
            ref={toastRef}
            className="mr-2 px-3 py-1.5 bg-aged-gold/10 border border-aged-gold/20 
                       backdrop-blur-md rounded-lg pointer-events-none"
          >
            <p className="font-label text-[10px] tracking-[0.15em] uppercase text-aged-gold/80">
              Toggle for music
            </p>
            <div className="absolute -top-1 right-6 w-2 h-2 bg-near-black rotate-45 border-l border-t border-aged-gold/20" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes soundbar {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
