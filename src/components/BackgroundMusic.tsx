import { useRef, useState, useEffect, useCallback } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4; // Subtle volume
    audio.loop = true;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsMuted(true);
        });
    }
    const handleInteraction = () => {
      if (audio.paused && !isPlaying) {
        audio.play().then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        }).catch(() => {});
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/ambient.mp3"
        preload="auto"
        muted={isMuted}
      />

      {/* Mute Toggle - Top Right Corner */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-[9998] group flex items-center gap-2 px-4 py-2 
                   bg-near-black/60 backdrop-blur-sm border border-aged-gold/20 
                   rounded-full hover:border-aged-gold/50 transition-all duration-300
                   font-label text-xs tracking-[0.2em] uppercase text-aged-gold/70 
                   hover:text-aged-gold"
        aria-label={isMuted ? 'Unmute ambient music' : 'Mute ambient music'}
      >
        {/* Sound wave animation when playing */}
        {!isMuted && isPlaying && (
          <span className="flex items-center gap-0.5 mr-1">
            <span className="w-0.5 h-2 bg-aged-gold/60 animate-[soundbar_0.5s_ease-in-out_infinite]" />
            <span className="w-0.5 h-3 bg-aged-gold/60 animate-[soundbar_0.7s_ease-in-out_infinite_0.1s]" />
            <span className="w-0.5 h-1.5 bg-aged-gold/60 animate-[soundbar_0.6s_ease-in-out_infinite_0.2s]" />
          </span>
        )}

        {/* Icon */}
        {isMuted ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Add soundbar animation keyframes to your global CSS or tailwind config */}
      <style>{`
        @keyframes soundbar {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}