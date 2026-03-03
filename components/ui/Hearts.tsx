"use client";

import Image from "next/image";
import { useLives } from "@/context/LivesContext";

export default function Hearts() {
  const { lives } = useLives();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "#FFF0F6",
        padding: "6px 12px",
        borderRadius: "999px",
        border: "1px solid #FFD6E7",
      }}
    >
      {[...Array(3)].map((_, i) => (
        <Image
          key={i}
          src={
            i < lives
              ? "/images/heart-full.png"
              : "/images/heart-empty.png"
          }
          alt="life"
          width={26}
          height={26}
        />
      ))}
    </div>
  );
}