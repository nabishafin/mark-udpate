import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
type Props = {
  count?: number;
  className?: string;
  color?: string;
  minSize?: number;
  maxSize?: number;
};
/** Ambient floating biotech particles. Cheap to render. */
export function Particles({
  count = 28,
  className = '',
  color = 'rgba(63,184,255,0.6)',
  minSize = 1.5,
  maxSize = 3.5
}: Props) {
  const dots = useMemo(() => {
    return Array.from({
      length: count
    }).map((_, i) => {
      const size = minSize + Math.random() * (maxSize - minSize);
      return {
        id: i,
        size,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 6,
        drift: (Math.random() - 0.5) * 60
      };
    });
  }, [count, minSize, maxSize]);
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden>
      
      {dots.map((d) =>
      <motion.span
        key={d.id}
        className="absolute rounded-full"
        style={{
          left: `${d.left}%`,
          top: `${d.top}%`,
          width: d.size,
          height: d.size,
          background: color,
          boxShadow: `0 0 ${d.size * 4}px ${color}`
        }}
        animate={{
          y: [0, -40, 0],
          x: [0, d.drift, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: d.duration,
          delay: d.delay,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />

      )}
    </div>);

}