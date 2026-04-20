import { useRef, useEffect } from 'react';

/**
 * GrainOverlay - Static film grain/paper texture overlay
 * Renders once, no animation loop for better performance
 */
export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Generate static noise once
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const value = Math.random() > 0.5 ? 255 : 0;
          data[i] = value;     // R
          data[i + 1] = value; // G
          data[i + 2] = value; // B
          data[i + 3] = 30;    // Alpha - visible but subtle
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 9999,
        opacity: 0.5,
        mixBlendMode: 'soft-light',
      }}
      aria-hidden="true"
    />
  );
}