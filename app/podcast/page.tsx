"use client";

import TopBar from "@/components/ui/TopBar";
import { useEffect, useRef, useState } from "react";

export default function PodcastPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const playPodcast = async () => {
      try {
        // 1️⃣ Get AI notes
        const notesRes = await fetch("/api/generate-notes", { method: "POST" });
        const { notes } = await notesRes.json();

        // 2️⃣ Convert notes to podcast audio
        const voiceRes = await fetch("/api/generate-podcast", {
          method: "POST",
          body: JSON.stringify({ text: notes }),
          headers: { "Content-Type": "application/json" },
        });

        if (!voiceRes.ok) throw new Error("Podcast API failed");

        const blob = await voiceRes.blob();
        const url = URL.createObjectURL(blob);

        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }

        setLoading(false);
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
        background: "linear-gradient(to bottom, #fff1f6, #e0f7fa)",
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
          flexDirection: "column",
        }}
      >
        {/* 🐱 Mascot */}
        <div
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#ffeef5",
            border: "5px solid #ffd6e7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "35px",
            boxShadow: "0 10px 40px rgba(255,182,193,0.35)",
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
            gap: "10px",
            height: "60px",
            marginBottom: "25px",
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: "10px",
                height: "100%",
                background: "linear-gradient(to top, #ff9ebb, #a0e7ff)",
                borderRadius: "10px",
                transformOrigin: "bottom",

                animationName: "bounce",
                animationDuration: "1.2s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* 🎧 Status */}
        <p style={{ color: "#555", fontSize: "16px" }}>
          {loading
            ? "Mimi is turning your notes into a podcast..."
            : "Now playing your AI podcast 🎧"}
        </p>
      </div>

      {/* 🎵 Hidden audio element */}
      <audio ref={audioRef} />

      {/* 🌊 Wave Animation */}
      <style jsx global>{`
        @keyframes bounce {
          0%,
          100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
