"use client";

import { useEffect, useState } from "react";

type Props = {
  label?: string;
};

export default function ProgressLoader({
  label = "Generating questions...",
}: Props) {
  const [progress, setProgress] = useState(10);

  // fake smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p; // stop near end
        return p + Math.random() * 8;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "120px auto",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>{label}</h2>

      {/* Progress Bar Background */}
      <div
        style={{
          width: "100%",
          height: 14,
          background: "#f3f3f3",
          borderRadius: 999,
          overflow: "hidden",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        {/* Progress Fill */}
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: 999,
            background:
              "linear-gradient(90deg,#ff9ebb,#ffc8dd,#9edbff)",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <p
        style={{
          marginTop: 12,
          color: "#777",
          fontSize: 14,
        }}
      >
        AI is preparing your game...
      </p>
    </div>
  );
}
