"use client";

import { useRouter } from "next/navigation";
import { useLives } from "@/context/LivesContext";
import { soundManager } from "@/utils/soundManager";
import { useEffect, useState } from "react";

const games = [
  {
    title: "MCQ Challenge",
    path: "/arcade/mcq",
    desc: "Answer AI-generated questions from your notes.",
    image: "/images/arcade/mcq.gif",
  },
  {
    title: "Memory Match",
    path: "/arcade/memory",
    desc: "Match concepts with meanings.",
    image: "/images/arcade/memory.gif",
  },
  {
    title: "Speed Recall",
    path: "/arcade/speed",
    desc: "Quick answers under time pressure.",
    image: "/images/arcade/speed.gif",
  },
  {
    title: "Fill in the Blank",
    path: "/arcade/fill",
    desc: "Complete missing concepts.",
    image: "/images/arcade/fill.gif",
  },
];

const mascotLines = [
  "You survived the tutorial. Impressive.",
  "Choose wisely. I am watching.",
  "Brains loading... hopefully yours too.",
  "Arcade mode activated.",
  "Do not embarrass me."
];

export default function ArcadePage() {
  const router = useRouter();
  const { lives } = useLives();
  const noLives = lives === 0;

  const [line, setLine] = useState("");

  useEffect(() => {
    const random =
      mascotLines[Math.floor(Math.random() * mascotLines.length)];
    setLine(random);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/arcade/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "60px 20px",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          backdropFilter: "brightness(0.9)",
          minHeight: "100vh",
        }}
      >
        {/* Mascot Section */}
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto 50px auto",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src="/images/arcade/mascot-comment.png"
            style={{
              width: "120px",
              imageRendering: "pixelated",
              animation: "float 3s ease-in-out infinite",
            }}
          />

          <div
            style={{
              background: "white",
              padding: "18px 22px",
              borderRadius: "18px",
              fontFamily: "monospace",
              boxShadow: "0 6px 0 #000",
            }}
          >
            {line}
          </div>
        </div>

        {/* Games Grid */}
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "30px",
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
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow:
                  "0 8px 0 #000, 0 12px 30px rgba(0,0,0,0.3)",
                transition: "0.2s",
                opacity: noLives ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!noLives) {
                  e.currentTarget.style.transform =
                    "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 0 #000, 0 18px 40px rgba(255,105,180,0.6)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 0 #000, 0 12px 30px rgba(0,0,0,0.3)";
              }}
            >
              <img
                src={game.image}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  imageRendering: "pixelated",
                }}
              />

              <div style={{ padding: "20px" }}>
                <h3
                  style={{
                    marginBottom: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  {game.title}
                </h3>

                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "18px",
                  }}
                >
                  {game.desc}
                </p>

                <button
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "12px",
                    border: "2px solid black",
                    background: "#ff9bd2",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  PLAY
                </button>

                {noLives && (
                  <p
                    style={{
                      marginTop: "10px",
                      color: "red",
                      fontSize: "13px",
                    }}
                  >
                    No lives remaining
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
}