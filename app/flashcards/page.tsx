"use client";

import { useEffect, useState } from "react";

interface Flashcard {
  question: string;
  answer: string;
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFlashcards = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/flashcards", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch flashcards");
      const data: Flashcard[] = await res.json();
      setFlashcards(data);
      setCurrentIndex(0);
      setShowAnswer(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  // Listen for PDF uploads
  useEffect(() => {
    const handler = () => fetchFlashcards();
    window.addEventListener("flashcardsUpdated", handler);
    return () => window.removeEventListener("flashcardsUpdated", handler);
  }, []);

  const nextCard = () => { setShowAnswer(false); setCurrentIndex((prev) => (prev + 1) % flashcards.length); };
  const prevCard = () => { setShowAnswer(false); setCurrentIndex((prev) => prev === 0 ? flashcards.length - 1 : prev - 1); };
  const toggleAnswer = () => setShowAnswer((prev) => !prev);

  if (loading) return <div className="p-4">Loading flashcards...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const card = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {flashcards.length === 0 ? (
        <div className="text-gray-500">No flashcards found.</div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-center cursor-pointer" onClick={toggleAnswer}>
            <h2 className="text-lg font-semibold mb-2">
              {showAnswer ? card.answer : card.question}
            </h2>
            <p className="text-sm text-gray-400">(Click card to {showAnswer ? "show question" : "show answer"})</p>
          </div>

          <div className="flex mt-4 gap-4">
            <button onClick={prevCard} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Previous</button>
            <button onClick={nextCard} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Next</button>
          </div>

          <p className="mt-2 text-gray-400 text-sm">{currentIndex + 1} / {flashcards.length}</p>
        </>
      )}
    </div>
  );
}
