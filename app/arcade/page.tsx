"use client";

import { useRouter } from "next/navigation";
import { useLives } from "@/context/LivesContext";
import { soundManager } from "@/utils/soundManager";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const games = [
  {
    title: "MCQ Challenge",
    emoji: "🧩",
    path: "/arcade/mcq",
    desc: "Answer AI-generated questions from your notes.",
  },
  {
    title: "Memory Match",
    emoji: "🧠",
    path: "/arcade/memory",
    desc: "Match concepts with meanings.",
  },
  {
    title: "Speed Recall",
    emoji: "⚡",
    path: "/arcade/speed",
    desc: "Quick answers under time pressure.",
  },
  {
    title: "Fill in the Blank",
    emoji: "✏️",
    path: "/arcade/fill",
    desc: "Complete missing concepts.",
  },
];

export default function ArcadePage() {
  const router = useRouter();
  const { lives } = useLives();
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";
  const noLives = lives === 0;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        background: isDark ? "#121212" : "#F6FFF8",
        minHeight: "100vh",
        padding: "20px",
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
        }}
      >
        {games.map((game) => (
          <div
            key={game.title}
            onClick={() => {
              if (!noLives) {
                soundManager.playClick();
                router.push(game.path);
              }
            }}
            style={{
              cursor: noLives ? "not-allowed" : "pointer",
              background: isDark ? "#1E1E1E" : "white",
              color: isDark ? "#ffffff" : "#000000",
              borderRadius: "22px",
              padding: "24px",
              boxShadow: isDark
                ? "0 12px 30px rgba(0,0,0,0.4)"
                : "0 12px 30px rgba(0,0,0,0.08)",
              transition: "0.2s",
              opacity: noLives ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!noLives)
                e.currentTarget.style.transform =
                  "translateY(-4px)";
            }}
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform =
                "translateY(0)")
            }
          >
            <div style={{ fontSize: "34px" }}>
              {game.emoji}
            </div>

            <h3
              style={{
                marginTop: "10px",
                color: isDark ? "#ffffff" : "#000000",
              }}
            >
              {game.title}
            </h3>

            <p
              style={{
                color: isDark ? "#bbbbbb" : "#666",
                fontSize: "14px",
              }}
            >
              {game.desc}
            </p>

            {noLives && (
              <p
                style={{
                  marginTop: "10px",
                  color: "red",
                  fontSize: "13px",
                }}
              >
                🔒 No lives remaining
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}