"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startGame = () => {
    // 🔊 click sound
    const audio = new Audio("/click.mp3");
    audio.play();

    setLoading(true);

    // fake loading before entering app
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom, #FFF6EC, #E6F7F2)",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* 🐱 Mascot */}
      <Image
        src="/mascot2.png"
        alt="Mascot"
        width={160}
        height={160}
        style={{ marginBottom: "16px" }}
      />

      {/* 🏝 Logo */}
      <Image
        src="/logo.png"
        alt="Learnisle Logo"
        width={220}
        height={90}
        style={{ marginBottom: "40px", objectFit: "contain" }}
      />

      {/* ▶ PLAY BUTTON */}
      {!loading && (
        <button
          onClick={startGame}
          style={{
            padding: "14px 42px",
            fontSize: "20px",
            borderRadius: "999px",
            border: "none",
            background: "#FFB7D5",
            color: "#2F3E34",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            transition: "transform 0.1s ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ▶ Play
        </button>
      )}

      {/* 📊 Loading Bar */}
      {loading && (
        <div style={{ width: "240px", marginTop: "24px" }}>
          <div
            style={{
              height: "12px",
              width: "100%",
              background: "#ffd6e7",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                background: "#6EE7B7",
                animation: "load 2s linear forwards",
              }}
            />
          </div>
          <p style={{ marginTop: "12px", fontSize: "14px", color: "#2F3E34" }}>
            Loading your island...
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes load {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
