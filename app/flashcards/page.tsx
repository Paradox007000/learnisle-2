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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await fetch("/api/get-flashcards");
        const data = await res.json();

         if (!res.ok) {
          setError(data.error || "Something went wrong.");
          return;

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <h2 className="text-2xl font-semibold text-gray-700 animate-pulse">
          Generating Flashcards...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <h2 className="text-xl font-semibold text-red-500">{error}</h2>
      </div>
    );
  }

  const card = flashcards[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 px-6">

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Flashcards</h1>
        <p className="text-gray-500 mt-2">
          {currentIndex + 1} / {flashcards.length}
        </p>
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-xl h-[350px] perspective cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-2xl flex items-center justify-center p-10 text-center">
            <p className="text-xl font-medium text-gray-800 leading-relaxed">
              {card.question}
            </p>
          </div>

          {/* Back - Soft Faded Pink */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-pink-100 text-pink-700 rounded-3xl shadow-2xl flex items-center justify-center p-10 text-center">
            <p className="text-xl font-medium leading-relaxed">
              {card.answer}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
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
  );
}

