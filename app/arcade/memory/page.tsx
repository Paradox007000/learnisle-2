"use client";

import { useEffect, useState } from "react";

type Card = {
  id: string;
  text: string;
  pairId: string;
  type: "question" | "answer";
  flipped: boolean;
  matched: boolean;
  status?: "correct" | "wrong";
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [gameState, setGameState] =
    useState<"loading" | "preview" | "playing" | "finished">(
      "loading"
    );

  const [selected, setSelected] = useState<Card[]>([]);

  // ✅ shuffle helper
  function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // -----------------------------
  // Load Game
  // -----------------------------
  async function loadGame() {
    setGameState("loading");

    const res = await fetch("/api/arcade/memory");
    const data = await res.json();

    if (!data?.pairs) return;

    const generated: Card[] = [];

    data.pairs.forEach((pair: any, index: number) => {
      const id = String(index);

      generated.push({
        id: id + "q",
        text: pair.question,
        pairId: id,
        type: "question",
        flipped: true,
        matched: false,
      });

      generated.push({
        id: id + "a",
        text: pair.answer,
        pairId: id,
        type: "answer",
        flipped: true,
        matched: false,
      });
    });

    const questions = shuffle(
      generated.filter((c) => c.type === "question")
    );

    const answers = shuffle(
      generated.filter((c) => c.type === "answer")
    );

    setCards([...questions, ...answers]);
    setGameState("preview");

    // 👀 preview
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => ({ ...c, flipped: false }))
      );
      setGameState("playing");
    }, 3000);
  }

  useEffect(() => {
    loadGame();
  }, []);

  // -----------------------------
  // Card Click
  // -----------------------------
  function handleClick(card: Card) {
    if (gameState !== "playing") return;
    if (card.flipped || card.matched) return;
    if (selected.length === 2) return;

    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id ? { ...c, flipped: true } : c
      )
    );

    const newSelected = [...selected, card];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      checkMatch(newSelected);
    }
  }

  // -----------------------------
  // Match Logic
  // -----------------------------
  function checkMatch(sel: Card[]) {
    const [a, b] = sel;

    const isMatch =
      a.pairId === b.pairId && a.type !== b.type;

    // show colors
    setCards((prev) =>
      prev.map((c) =>
        c.id === a.id || c.id === b.id
          ? {
              ...c,
              status: isMatch ? "correct" : "wrong",
            }
          : c
      )
    );

    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => {
          if (c.id === a.id || c.id === b.id) {
            if (isMatch) {
              return {
                ...c,
                matched: true,
                status: undefined,
              };
            } else {
              return {
                ...c,
                flipped: false,
                status: undefined,
              };
            }
          }
          return c;
        })
      );

      setSelected([]);
    }, 900);
  }

  // -----------------------------
  // Win Check
  // -----------------------------
  useEffect(() => {
    if (
      cards.length > 0 &&
      cards.every((c) => c.matched)
    ) {
      setGameState("finished");
    }
  }, [cards]);

  // split layout
  const questions = cards.filter(
    (c) => c.type === "question"
  );
  const answers = cards.filter(
    (c) => c.type === "answer"
  );

  // -----------------------------
  // Card Styling
  // -----------------------------
  function cardStyle(card: Card) {
    if (card.status === "correct")
      return "bg-green-400 text-white";

    if (card.status === "wrong")
      return "bg-red-400 text-white";

    if (card.flipped || card.matched)
      return "bg-white text-black";

    // 🌸 pink back
    return "bg-pink-300 text-transparent";
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">
        🧠 Memory Match
      </h1>

      {gameState === "preview" && (
        <p className="mb-6">👀 Memorize...</p>
      )}

      {gameState === "finished" && (
        <p className="mb-6 text-green-600 text-xl">
          🎉 Perfect Match!
        </p>
      )}

      <div className="flex gap-16">
        {/* QUESTIONS */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Questions
          </h2>

          <div className="flex flex-col gap-5">
            {questions.map((card) => (
              <button
                key={card.id}
                onClick={() => handleClick(card)}
                className={`w-72 h-32 rounded-2xl shadow-lg text-lg font-medium flex items-center justify-center text-center p-4 transition-all duration-300 ${cardStyle(
                  card
                )}`}
              >
                {card.flipped || card.matched
                  ? card.text
                  : "?"}
              </button>
            ))}
          </div>
        </div>

        {/* ANSWERS */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Answers
          </h2>

          <div className="flex flex-col gap-5">
            {answers.map((card) => (
              <button
                key={card.id}
                onClick={() => handleClick(card)}
                className={`w-72 h-32 rounded-2xl shadow-lg text-lg font-medium flex items-center justify-center text-center p-4 transition-all duration-300 ${cardStyle(
                  card
                )}`}
              >
                {card.flipped || card.matched
                  ? card.text
                  : "?"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
