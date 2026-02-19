"use client";

import { useEffect, useState } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";

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
    useState<"loading" | "preview" | "playing" | "finished" | "error">(
      "loading"
    );

  const [selected, setSelected] = useState<Card[]>([]);

  // -----------------------------
  // shuffle helper
  // -----------------------------
  function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // -----------------------------
  // Load Game
  // -----------------------------
  async function loadGame() {
    try {
      setGameState("loading");

      // allow loader to render first
      await new Promise((r) => setTimeout(r, 60));

      const res = await fetch("/api/arcade/memory");

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      if (!data?.pairs) throw new Error("No pairs returned");

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

      // preview phase
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => ({ ...c, flipped: false }))
        );
        setGameState("playing");
      }, 3000);
    } catch (err) {
      console.error(err);
      setGameState("error");
    }
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

    setCards((prev) =>
      prev.map((c) =>
        c.id === a.id || c.id === b.id
          ? { ...c, status: isMatch ? "correct" : "wrong" }
          : c
      )
    );

    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => {
          if (c.id === a.id || c.id === b.id) {
            if (isMatch)
              return { ...c, matched: true, status: undefined };

            return {
              ...c,
              flipped: false,
              status: undefined,
            };
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
    if (cards.length && cards.every((c) => c.matched)) {
      setGameState("finished");
    }
  }, [cards]);

  // -----------------------------
  // UI STATES
  // -----------------------------

  if (gameState === "loading") {
    return (
      <ProgressLoader label="Preparing memory game..." />
    );
  }

  if (gameState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Unable to generate game. Please create notes first.
        </p>
      </div>
    );
  }

  const questions = cards.filter(
    (c) => c.type === "question"
  );
  const answers = cards.filter(
    (c) => c.type === "answer"
  );

  function cardStyle(card: Card) {
    if (card.status === "correct")
      return "bg-green-500 text-white";

    if (card.status === "wrong")
      return "bg-red-500 text-white";

    if (card.flipped || card.matched)
      return "bg-white text-gray-800";

    return "bg-pink-200 text-transparent";
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <h1 className="text-3xl font-semibold mb-10 text-gray-800">
        Memory Match
      </h1>

      {gameState === "preview" && (
        <p className="mb-8 text-gray-500">
          Memorize the pairs
        </p>
      )}

      {gameState === "finished" && (
        <p className="mb-8 text-green-600 font-medium">
          All pairs matched
        </p>
      )}

      <div className="flex gap-20">
        {/* QUESTIONS */}
        <section>
          <h2 className="text-lg font-medium mb-6 text-center text-gray-600">
            Questions
          </h2>

          <div className="flex flex-col gap-6">
            {questions.map((card) => (
              <button
                key={card.id}
                onClick={() => handleClick(card)}
                className={`w-80 h-36 rounded-2xl shadow-md flex items-center justify-center text-center p-6 transition-all duration-300 ${cardStyle(
                  card
                )}`}
              >
                {card.flipped || card.matched
                  ? card.text
                  : " "}
              </button>
            ))}
          </div>
        </section>

        {/* ANSWERS */}
        <section>
          <h2 className="text-lg font-medium mb-6 text-center text-gray-600">
            Answers
          </h2>

          <div className="flex flex-col gap-6">
            {answers.map((card) => (
              <button
                key={card.id}
                onClick={() => handleClick(card)}
                className={`w-80 h-36 rounded-2xl shadow-md flex items-center justify-center text-center p-6 transition-all duration-300 ${cardStyle(
                  card
                )}`}
              >
                {card.flipped || card.matched
                  ? card.text
                  : " "}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
