import React, { useEffect, useRef } from 'react';

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseCoords.current.x = clientX;
      mouseCoords.current.y = clientY;
      dot.style.left = `${clientX - 4}px`;
      dot.style.top = `${clientY - 4}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);

      // Smooth interpolation for the outer ring
      ringCoords.current.x += (mouseCoords.current.x - ringCoords.current.x) * 0.12;
      ringCoords.current.y += (mouseCoords.current.y - ringCoords.current.y) * 0.12;

      ring.style.left = `${ringCoords.current.x - 16}px`;
      ring.style.top = `${ringCoords.current.y - 16}px`;
    };

    loop();

    const addHoverListeners = () => {
      const clickables = document.querySelectorAll('a, button, [onclick], .proj-card, .stack-card, .ach-card, .cert-deck-card, .edu-card');
      clickables.forEach((el) => {
        const handleMouseEnter = () => {
          ring.style.width = '48px';
          ring.style.height = '48px';
          dot.style.transform = 'scale(1.5)';
        };
        const handleMouseLeave = () => {
          ring.style.width = '32px';
          ring.style.height = '32px';
          dot.style.transform = 'scale(1)';
        };
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Delay a bit to allow DOM elements to fully render
    const timeoutId = setTimeout(addHoverListeners, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} id="cursor-dot" />
      <div ref={ringRef} id="cursor-ring" />
    </>
  );
};
