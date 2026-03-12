"use client";

import Image from "next/image";
import useStudySession from "@/hooks/useStudySession";

export default function LifeTimer() {
  const { formattedTime } = useStudySession();

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
        {formattedTime}
      </span>
    </div>
  );
}