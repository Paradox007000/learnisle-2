"use client";

import { useRouter } from "next/navigation";

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

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        🎮 Arcade
      </h1>

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
            onClick={() => router.push(game.path)}
            style={{
              cursor: "pointer",
              background: "white",
              borderRadius: "22px",
              padding: "24px",
              boxShadow:
                "0 12px 30px rgba(0,0,0,0.08)",
              transition: "0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform =
                "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform =
                "translateY(0)")
            }
          >
            <div style={{ fontSize: "34px" }}>
              {game.emoji}
            </div>

            <h3 style={{ marginTop: "10px" }}>
              {game.title}
            </h3>

            <p
              style={{
                color: "#666",
                fontSize: "14px",
              }}
            >
              {game.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
