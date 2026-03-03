"use client";

import Image from "next/image";
import { useLives } from "@/context/LivesContext";

export default function LifeTimer() {
  const { lives, nextLifeIn } = useLives();

  // Hide timer if lives are full
  if (lives >= 5) return null;

  const minutes = Math.floor(nextLifeIn / 60);
  const seconds = nextLifeIn % 60;

  const formatted = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#ffffff",
        padding: "8px 14px",
        borderRadius: "999px",
        border: "1px solid #E0F2E9",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <Image
        src="/images/clock.png"
        alt="timer"
        width={20}
        height={20}
      />

      <span
        style={{
          fontWeight: 600,
          color: "#2F3E34",
          fontSize: "14px",
        }}
      >
        {formatted}
      </span>
    </div>
  );
}