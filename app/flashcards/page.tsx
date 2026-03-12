"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import TopBar from "@/components/ui/TopBar";
import { Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const flashcardRef = useRef<HTMLDivElement>(null);

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  // Fetch flashcards
  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/get-flashcards");
        const data = await res.json();
        if (!res.ok || !data.flashcards) throw new Error("Failed");
        setFlashcards(data.flashcards);
      } catch (err) {
        console.error("Error fetching flashcards:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFlashcards();
  }, []);

  // Update progress
  useEffect(() => {
    if (!flashcards.length) return;
    const percent = ((current + 1) / flashcards.length) * 100;
    setProgress(percent);
  }, [current, flashcards]);

  const nextCard = () => {
    setFlipped(false);
    setCurrent((prev) => (prev + 1 < flashcards.length ? prev + 1 : prev));
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrent((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/bg-4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {/* MENU */}
      {isMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "300px",
            height: "100vh",
            background: isDark ? "#1E1E1E" : "white",
            zIndex: 999999,
            boxShadow: "5px 0 20px rgba(0,0,0,0.15)",
            padding: "30px 20px",
          }}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              fontSize: "28px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isDark ? "#fff" : "#111",
            }}
          >
            ×
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "40px" }}>
            {[
              { href: "/dashboard", label: "Home", icon: <Home size={24} color="#ec4899" /> },
              { href: "/arcade", label: "Arcade", icon: <Gamepad2 size={24} color="#ec4899" /> },
              { href: "/document", label: "Document", icon: <FileText size={24} color="#ec4899" /> },
              { href: "/podcast", label: "Podcast", icon: <Mic size={24} color="#ec4899" /> },
              { href: "/flashcards", label: "Flashcards", icon: <CreditCard size={24} color="#ec4899" /> },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} onClick={() => setIsMenuOpen(false)} style={menuStyle}>
                {item.icon} {item.label}
              </Link>
            ))}

            <hr style={{ margin: "12px 0", borderColor: isDark ? "#333" : "#eee" }} />

            <Link href="/mimi" onClick={() => setIsMenuOpen(false)} style={{ ...menuStyle, gap: "12px", display: "flex", alignItems: "center" }}>
              <img src="/mascot.png" alt="Mimi" style={{ width: "28px", height: "28px" }} />
              Mimi
            </Link>

            <hr style={{ margin: "12px 0", borderColor: isDark ? "#333" : "#eee" }} />

            <Link href="/account" onClick={() => setIsMenuOpen(false)} style={menuStyle}>
              <User size={24} color="#ec4899" /> Account
            </Link>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 99999,
          }}
        />
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            width: "800px",
            padding: "60px",
            borderRadius: "40px",
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(30px)",
            boxShadow: "0 40px 120px rgba(255,105,160,0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <h2 style={{ fontSize: "22px" }}>Flashcards</h2>

          {/* LOADING */}
          {loading && (
            <>
              <p style={{ opacity: 0.7 }}>Generating flashcards...</p>
              <div
                style={{
                  width: "60%",
                  height: "10px",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "60%",
                    height: "100%",
                    background: "linear-gradient(90deg,#ff7aa8,#ff4f91)",
                    borderRadius: "20px",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              </div>
            </>
          )}

          {/* FLASHCARD */}
          {!loading && flashcards.length > 0 && (
            <>
              <div
                ref={flashcardRef}
                style={{
                  width: "100%",
                  height: "250px",
                  perspective: "1000px",
                  cursor: "pointer",
                }}
                onClick={() => setFlipped(!flipped)}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.5s",
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: "20px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "30px",
                      textAlign: "center",
                      fontSize: "20px",
                    }}
                  >
                    {flashcards[current].question}
                  </div>

                  {/* BACK */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "rgba(255,182,193,0.6)",
                      borderRadius: "20px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "30px",
                      textAlign: "center",
                      fontSize: "20px",
                    }}
                  >
                    {flashcards[current].answer}
                  </div>
                </div>
              </div>

              {/* PROGRESS */}
              <div
                style={{
                  width: "70%",
                  height: "8px",
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: "20px",
                  marginTop: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg,#ff7aa8,#ff4f91)",
                    borderRadius: "20px",
                    transition: "width 0.3s",
                  }}
                />
              </div>

              {/* BUTTONS */}
              <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                <button onClick={prevCard} style={buttonStyle}>
                  Previous
                </button>

                <button onClick={() => setFlipped(!flipped)} style={buttonStyle}>
                  Flip
                </button>

                <button onClick={nextCard} style={buttonStyle}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const menuStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "16px 18px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "16px",
  transition: "all 0.2s ease",
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "#ff7aa8",
  color: "white",
  fontWeight: 600,
  transition: "0.2s",
};