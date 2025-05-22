'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface CircleAnimationProps {
  children: ReactNode[];
}

interface CircleState {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export default function CircleAnimation({ children }: CircleAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [circles, setCircles] = useState<CircleState[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    // Initialize circles with slow velocities
    const initialCircles = Array.from({ length: children.length }, () => ({
      x: Math.random() * (width - 300) + 150,
      y: Math.random() * (height - 300) + 150,
      dx: (Math.random() - 0.5) * 0.5, // Even slower initial velocity
      dy: (Math.random() - 0.5) * 0.5,
    }));

    setCircles(initialCircles);

    function animate() {
      setCircles(prevCircles => {
        return prevCircles.map(circle => {
          // Apply very gentle continuous movement
          const damping = 0.999;
          let newDx = circle.dx * damping;
          let newDy = circle.dy * damping;

          // Add tiny random movement to keep circles moving
          if (Math.abs(newDx) < 0.1 && Math.abs(newDy) < 0.1) {
            newDx += (Math.random() - 0.5) * 0.15;
            newDy += (Math.random() - 0.5) * 0.15;
          }

          // Update position
          let newX = circle.x + newDx;
          let newY = circle.y + newDy;

          // Wrap around screen edges smoothly
          if (newX < -150) newX = width + 150;
          if (newX > width + 150) newX = -150;
          if (newY < -150) newY = height + 150;
          if (newY > height + 150) newY = -150;

          return {
            x: newX,
            y: newY,
            dx: newDx,
            dy: newDy,
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [children.length]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {children.map((child, index) => (
        <div
          key={index}
          className="absolute transform transition-transform duration-1000 ease-linear"
          style={{
            left: `${circles[index]?.x ?? 0}px`,
            top: `${circles[index]?.y ?? 0}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
} 