"use client";

import { useEffect, useState } from "react";

export function AmbientBackground() {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; delay: string; size: string; opacity: number }[]>([]);
  const [shootingStars, setShootingStars] = useState<{ id: number; top: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate static stars for twinkling
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setStars(newStars);

    // Generate shooting stars
    const newShootingStars = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 50}%`,
      delay: `${Math.random() * 15 + i * 5}s`,
    }));
    setShootingStars(newShootingStars);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0f0c29]">
      {/* Deep space gradient matching the tarot site */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#0f0c29]"></div>
      
      {/* Nebulas */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-[120px] animate-[float-slow_20s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-l from-indigo-500/15 to-transparent rounded-full blur-[150px] animate-[float-medium_25s_ease-in-out_infinite_reverse]"></div>

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-[twinkle_3s_ease-in-out_infinite]"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            opacity: star.opacity,
          }}
        ></div>
      ))}

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={`shooting-${star.id}`}
          className="absolute h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent animate-[shooting-star_10s_linear_infinite] opacity-0"
          style={{
            top: star.top,
            left: '-10%',
            animationDelay: star.delay,
            transform: 'rotate(-45deg)',
          }}
        ></div>
      ))}
    </div>
  );
}
