"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/ui/TopBar";
import { Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await fetch("/api/get-flashcards");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Something went wrong.");
          return;
        }

        if (!data.flashcards || data.flashcards.length === 0) {
          setError("No flashcards generated.");
        } else {
          setFlashcards(data.flashcards);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load flashcards.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) =>
      prev === flashcards.length - 1 ? 0 : prev + 1
    );
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) =>
      prev === 0 ? flashcards.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted text-foreground dark:bg-[#1E1E1E]">
        <h2 className="text-2xl font-semibold animate-pulse">
          Generating Flashcards...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted text-foreground dark:bg-[#1E1E1E]">
        <h2 className="text-xl font-semibold text-red-500">{error}</h2>
      </div>
    );
  }

  const card = flashcards[currentIndex];

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <div className="min-h-screen flex flex-col bg-muted text-foreground dark:bg-[#1E1E1E]">

<div className="bg-white/80 dark:bg-[#1E1E1E]/90 backdrop-blur-md">
  <TopBar openMenu={() => setIsMenuOpen(true)} />
</div>

      {/* MENU DRAWER */}
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
              color: isDark ? "#ffffff" : "#111",
            }}
          >
            ×
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginTop: "40px",
            }}
          >
            {[
              { href: "/dashboard", label: "Home", icon: <Home size={24} strokeWidth={2.5} color="#ec4899" /> },
              { href: "/arcade", label: "Arcade", icon: <Gamepad2 size={24} strokeWidth={2.5} color="#ec4899" /> },
              { href: "/document", label: "Document", icon: <FileText size={24} strokeWidth={2.5} color="#ec4899" /> },
              { href: "/podcast", label: "Podcast", icon: <Mic size={24} strokeWidth={2.5} color="#ec4899" /> },
              { href: "/flashcards", label: "Flashcards", icon: <CreditCard size={24} strokeWidth={2.5} color="#ec4899" /> },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  ...menuStyle,
                  color: isDark ? "#ffffff" : "#111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(128,128,128,0.08)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {item.icon} {item.label}
              </Link>
            ))}

            <hr style={{ margin: "12px 0", borderColor: isDark ? "#333" : "#eee" }} />

            <Link
              href="/mimi"
              onClick={() => setIsMenuOpen(false)}
              style={{
                ...menuStyle,
                gap: "12px",
                display: "flex",
                alignItems: "center",
                color: isDark ? "#ffffff" : "#111",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(128,128,128,0.08)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img
                src="/mascot.png"
                alt="Mascot"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
              Mimi
            </Link>

            <hr style={{ margin: "12px 0", borderColor: isDark ? "#333" : "#eee" }} />

            <Link
              href="/account"
              onClick={() => setIsMenuOpen(false)}
              style={{
                ...menuStyle,
                color: isDark ? "#ffffff" : "#111",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(128,128,128,0.08)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <User size={24} strokeWidth={2.5} color="#ec4899" /> Account
            </Link>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 99999,
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="flex flex-col items-center justify-center flex-1 px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Flashcards</h2>
          <p className="text-muted-foreground mt-2">
            {currentIndex + 1} / {flashcards.length}
          </p>
        </div>

        <div
          className="relative w-full max-w-xl h-[350px] perspective cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              flipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="absolute w-full h-full backface-hidden bg-white dark:bg-[#2A2A2A] rounded-3xl shadow-xl flex items-center justify-center p-10 text-center">
              <p className="text-xl font-medium leading-relaxed">
                {card.question}
              </p>
            </div>

            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-pink-100 dark:bg-pink-900 text-black dark:text-white rounded-3xl shadow-xl flex items-center justify-center p-10 text-center">
              <p className="text-xl font-medium leading-relaxed">
                {card.answer}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-10">
          <button
            onClick={prevCard}
            className="px-6 py-3 rounded-xl bg-pink-100 dark:bg-pink-900 text-black dark:text-white shadow-md hover:bg-pink-200 dark:hover:bg-pink-800 transition font-medium"
          >
            Previous
          </button>

          <button
            onClick={nextCard}
            className="px-6 py-3 rounded-xl bg-pink-100 dark:bg-pink-900 text-black dark:text-white shadow-md hover:bg-pink-200 dark:hover:bg-pink-800 transition font-medium"
          >
            Next
          </button>
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