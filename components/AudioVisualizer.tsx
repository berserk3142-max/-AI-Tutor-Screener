"use client";

import { useEffect, useState } from "react";

interface AudioVisualizerProps {
  isActive: boolean;
  barCount?: number;
  color?: string;
}

export default function AudioVisualizer({
  isActive,
  barCount = 24,
  color = "var(--accent-primary)",
}: AudioVisualizerProps) {
  const [heights, setHeights] = useState<number[]>(
    Array(barCount).fill(4)
  );

  useEffect(() => {
    if (!isActive) {
      setHeights(Array(barCount).fill(4));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array(barCount)
          .fill(0)
          .map(() => Math.random() * 40 + 4)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, barCount]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "3px",
        height: "48px",
        padding: "0 16px",
      }}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: "3px",
            height: `${h}px`,
            backgroundColor: color,
            borderRadius: "2px",
            transition: "height 0.15s ease",
            opacity: isActive ? 0.8 : 0.2,
          }}
        />
      ))}
    </div>
  );
}
