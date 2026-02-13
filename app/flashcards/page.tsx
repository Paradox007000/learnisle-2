"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/ui/TopBar";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ MENU STATE

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
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <h2 className="text-2xl font-semibold text-black animate-pulse">
          Generating Flashcards...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <h2 className="text-xl font-semibold text-red-500">{error}</h2>
      </div>
    );
  }

  const card = flashcards[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7]">

      {/* 🌸 TOP MENU BAR */}
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {/* MENU DRAWER */}
      {isMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "300px",
            height: "100vh",
            background: "white",
            zIndex: 999999,
            boxShadow: "5px 0 20px rgba(0,0,0,0.3)",
            padding: "40px 20px",
            transition: "transform 0.3s ease",
          }}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              fontSize: "30px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <div style={{ marginTop: "20px" }}>
            <Link href="/arcade" onClick={() => setIsMenuOpen(false)} style={menuStyle}>🎮 Arcade</Link>
            <Link href="/document" onClick={() => setIsMenuOpen(false)} style={menuStyle}>📄 Document</Link>
            <Link href="/podcast" onClick={() => setIsMenuOpen(false)} style={menuStyle}>🎙️ Podcast</Link>
            <Link href="/flashcards" onClick={() => setIsMenuOpen(false)} style={menuStyle}>🃏 Flashcards</Link>
            <hr style={dividerStyle} />
            <Link href="/mimi" onClick={() => setIsMenuOpen(false)} style={{ ...menuStyle, background: "#fce4ec" }}>😺 Mimi</Link>
            <hr style={dividerStyle} />
            <Link href="/account" onClick={() => setIsMenuOpen(false)} style={{ ...menuStyle, background: "#f5f5f5" }}>👤 Account</Link>
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

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center flex-1 px-6">

        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-black">Flashcards</h2>
          <p className="text-gray-500 mt-2">
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
            <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl flex items-center justify-center p-10 text-center">
              <p className="text-xl font-medium text-black leading-relaxed">
                {card.question}
              </p>
            </div>

            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-pink-100 text-black rounded-3xl shadow-xl flex items-center justify-center p-10 text-center">
              <p className="text-xl font-medium leading-relaxed">
                {card.answer}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-10">
          <button
            onClick={prevCard}
            className="px-6 py-3 rounded-xl bg-pink-100 text-black shadow-md hover:bg-pink-200 transition font-medium"
          >
            Previous
          </button>

          <button
            onClick={nextCard}
            className="px-6 py-3 rounded-xl bg-pink-100 text-black shadow-md hover:bg-pink-200 transition font-medium"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

const menuStyle = {
  display: "block",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "10px",
  background: "#e3f2fd",
  textDecoration: "none",
  color: "black",
  fontWeight: "bold",
};

const dividerStyle = {
  margin: "20px 0",
  border: "none",
  height: "1px",
  background: "#ddd",
};
