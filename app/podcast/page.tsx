"use client";

import TopBar from "@/components/ui/TopBar";
 import { useEffect, useRef } from "react";

export default function PodcastPage() {
   

const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  const playPodcast = async () => {
    try {
      // 1️⃣ Get notes from your document page
      const notesRes = await fetch("/api/notes"); // your generate notes route
      const { notes } = await notesRes.json();

      // 2️⃣ Send notes to voice route
      const voiceRes = await fetch("/api/podcast", {
        method: "POST",
        body: JSON.stringify({ text: notes }),
        headers: { "Content-Type": "application/json" },
      });

      const blob = await voiceRes.blob();
      const url = URL.createObjectURL(blob);

      // 3️⃣ Play audio
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (err) {
      console.error("Podcast error:", err);
    }
  };

  playPodcast();
}, []);

  return (
    <div
  style={{
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #fff1f6, #ffe4ec)",
    display: "flex",
    flexDirection: "column",
  }}
>
  <TopBar />

  <div
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: "28px",
        padding: "50px 40px",
        width: "100%",
        maxWidth: "600px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(255, 182, 193, 0.25)",
      }}
    >
      {/* 🐱 Mascot */}
      <div
        style={{
          width: "130px",
          height: "130px",
          margin: "0 auto 30px",
          borderRadius: "50%",
          overflow: "hidden",
          background: "#ffeef5",
          border: "4px solid #ffd6e7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/mascot.png"
          alt="Mimi mascot"
          style={{ width: "85%", height: "85%", objectFit: "contain" }}
        />
      </div>

      {/* 🌊 Sound Waves */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "8px",
          height: "50px",
          marginBottom: "30px",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "100%",
              background: "#ff9ebb",
              borderRadius: "6px",
              animation: "bounce 1s ease-in-out infinite",
              animationDelay: `${i * 0.12}s`,
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>

      <p style={{ color: "#666", fontSize: "16px" }}>
        Mimi is reading your study notes aloud 🎧
      </p>
    </div>
  </div>

  <style jsx global>{`
    @keyframes bounce {
      0%, 100% { transform: scaleY(0.4); }
      50% { transform: scaleY(1); }
    }
  `}</style>
  <audio ref={audioRef} />

</div>

  );
}
