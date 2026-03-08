"use client";

import { useEffect, useState } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";
import { soundManager } from "@/utils/soundManager";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Pair = {
  question: string;
  answer: string;
};

type MemoryCard = {
  id: number;
  type: "question" | "answer";
  text: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
  status?: "correct" | "wrong" | null;
};

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selected, setSelected] = useState<MemoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [mascotComment, setMascotComment] = useState("");
  const [previewing, setPreviewing] = useState(true);

  useEffect(() => {
    soundManager.playBackground();
    return () => soundManager.stopBackground();
  }, []);

  /* LOAD PAIRS */
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/arcade/memory");
      const data = await res.json();

      const pairs: Pair[] = data.pairs || [];

      const questionCards: MemoryCard[] = pairs.map((p, i) => ({
        id: i,
        type: "question",
        text: p.question,
        pairId: i,
        flipped: true,
        matched: false,
        status: null,
      }));

      const answerCards: MemoryCard[] = pairs.map((p, i) => ({
        id: i + 100,
        type: "answer",
        text: p.answer,
        pairId: i,
        flipped: true,
        matched: false,
        status: null,
      }));

      const shuffledAnswers = answerCards.sort(() => Math.random() - 0.5);

      const allCards = [...questionCards, ...shuffledAnswers];

      setCards(allCards);
      setLoading(false);

      /* 3 second preview */
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => ({ ...c, flipped: false }))
        );
        setPreviewing(false);
      }, 3000);
    }

    load();
  }, []);

  function handleFlip(card: MemoryCard) {
    if (previewing) return;
    if (card.flipped || card.matched) return;
    if (selected.length === 2) return;

    soundManager.playClick();

    const updatedCards = cards.map((c) =>
      c === card ? { ...c, flipped: true } : c
    );

    setCards(updatedCards);

    const newSelected = [...selected, { ...card, flipped: true }];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      checkMatch(newSelected);
    }
  }

  function checkMatch(selectedCards: MemoryCard[]) {
    const [first, second] = selectedCards;

    const correct =
      first.pairId === second.pairId &&
      first.type !== second.type;

    if (correct) {
      soundManager.playCorrect();
      setMascotComment("Perfect match ✨");

      setCards((prev) =>
        prev.map((c) =>
          c.pairId === first.pairId
            ? { ...c, matched: true, status: "correct" }
            : c
        )
      );

      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.status === "correct"
              ? { ...c, status: null }
              : c
          )
        );
        setSelected([]);
        setMascotComment("");
      }, 900);
    } else {
      soundManager.playWrong();
      setMascotComment("Not quite. Try again.");

      setCards((prev) =>
        prev.map((c) =>
          c.pairId === first.pairId ||
          c.pairId === second.pairId
            ? { ...c, status: "wrong" }
            : c
        )
      );

      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.pairId === first.pairId ||
            c.pairId === second.pairId
              ? { ...c, flipped: false, status: null }
              : c
          )
        );

        setSelected([]);
        setMascotComment("");
      }, 900);
    }
  }

  const allMatched = cards.every((c) => c.matched);

  if (loading)
    return <ProgressLoader label="Generating Memory Game..." />;

  if (allMatched)
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-2.png')" }}
      >
        <div className="bg-white/70 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center border border-pink-200">
          <h2 className="text-3xl font-bold text-pink-600">
            Level Complete
          </h2>
          <p className="mt-3 text-gray-600">
            You matched all pairs.
          </p>
        </div>
      </div>
    );

  const questions = cards.filter((c) => c.type === "question");
  const answers = cards.filter((c) => c.type === "answer");

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-2.png')" }}
    >
      <div className="relative w-full max-w-4xl bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200 p-10 space-y-10 text-center">
        
        <div className="grid grid-cols-3 gap-6">
          {questions.map((card) => (
            <MemoryCardUI key={card.id} card={card} handleFlip={handleFlip} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {answers.map((card) => (
            <MemoryCardUI key={card.id} card={card} handleFlip={handleFlip} />
          ))}
        </div>

        <div className="flex justify-center">
          <Image src="/images/arcade/hearts.gif" alt="heart" width={32} height={32}/>
        </div>
      </div>

      {/* Mascot */}
      <div className="absolute right-8 bottom-8 flex flex-col items-center">
        <Image src="/images/arcade/mascot-comment.png" alt="Mascot" width={140} height={140} className="drop-shadow-2xl"/>
        {mascotComment && (
          <div className="mt-4 bg-pink-100/90 backdrop-blur-md px-5 py-3 rounded-2xl text-sm text-pink-700 shadow-lg border border-pink-200 max-w-[220px] text-center">
            {mascotComment}
          </div>
        )}
      </div>
    </div>
  );
}

function MemoryCardUI({
  card,
  handleFlip,
}: {
  card: MemoryCard;
  handleFlip: (card: MemoryCard) => void;
}) {
  const statusColor =
    card.status === "correct"
      ? "bg-green-200 border-green-400"
      : card.status === "wrong"
      ? "bg-red-200 border-red-400"
      : "bg-white border-pink-200";

  return (
    <div
      className="relative w-full h-32 perspective cursor-pointer"
      onClick={() => handleFlip(card)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          card.flipped || card.matched ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT (MIMI) */}
        <Card className="absolute w-full h-full backface-hidden flex items-center justify-center bg-pink-100 border border-pink-200">
          <CardContent className="flex items-center justify-center">
            <Image
              src="/mascot.png"
              alt="mimi"
              width={50}
              height={50}
            />
          </CardContent>
        </Card>

        {/* BACK */}
        <Card
          className={`absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center ${statusColor}`}
        >
          <CardContent className="text-center text-pink-700 text-sm font-medium">
            {card.text}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}