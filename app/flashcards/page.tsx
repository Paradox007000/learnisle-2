"use client";

import { useEffect, useState } from "react";

interface Flashcard {
  question: string;
  answer: string;
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

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

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Generating Flashcards...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px", textAlign: "center" }}>
        🃏 Flashcards
      </h1>

      <div style={{ display: "grid", gap: "20px" }}>
        {flashcards.map((card, index) => (
          <div
            key={index}
            onClick={() =>
              setFlippedIndex(flippedIndex === index ? null : index)
            }
            style={{
              padding: "25px",
              borderRadius: "20px",
              background: "#ffffff",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              cursor: "pointer",
              minHeight: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {flippedIndex === index ? card.answer : card.question}
          </div>
        ))}
      </div>
    </div>
  );
}
