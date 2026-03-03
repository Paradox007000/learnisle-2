"use client";

import { useEffect, useState } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";
import {
  DEFAULT_STATE,
  processGameResult,
  ArcadeState,
} from "@/lib/arcade/arcadeEngine";
import { useLives } from "@/context/LivesContext";
import { soundManager } from "@/utils/soundManager";

// ✅ Import your reusable Card
import { Card, CardContent } from "@/components/ui/card";

/* ======================================
   TYPES
====================================== */

type MCQ = {
  question: string;
  options: string[];
  answer: string;
};

/* ======================================
   COMPONENT
====================================== */

export default function MCQGame() {
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const [arcadeState, setArcadeState] =
    useState<ArcadeState>(DEFAULT_STATE);

  const { loseLife, lives } = useLives();

  /* ======================================
     LOAD QUESTIONS
  ====================================== */

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/arcade/mcq");
        const data = await res.json();
        setQuestions(data.questions || []);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ======================================
     RESULT SYSTEM
  ====================================== */

  function applyResult(correct: boolean) {
    setArcadeState((prev) => {
      const updated = processGameResult(prev, { correct });

      if (correct) {
        soundManager.playCorrect();
      } else {
        soundManager.playWrong();
        loseLife();
      }

      return updated;
    });
  }

  /* ======================================
     OPTION CLICK
  ====================================== */

  function handleOptionClick(option: string) {
    if (selectedOption || finished || lives === 0) return;

    soundManager.playClick();

    setSelectedOption(option);

    const current = questions[index];
    const correct = option === current.answer;

    applyResult(correct);

    setTimeout(() => {
      setSelectedOption(null);

      if (index + 1 >= questions.length || lives <= 1) {
        setFinished(true);
      } else {
        setIndex((prev) => prev + 1);
      }
    }, 1000);
  }

  /* ======================================
     STATES
  ====================================== */

  if (loading)
    return <ProgressLoader label="Generating MCQs..." />;

  if (finished)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold mb-6">
          🎉 Level Complete!
        </h1>

        <p className="text-lg">
          ⭐ Final XP: {arcadeState.score}
        </p>

        <p className="text-lg">
          🔥 Final Streak: {arcadeState.streak}
        </p>
      </div>
    );

  const current = questions[index];

  if (!current)
    return (
      <p className="p-10 text-center">
        Create notes first.
      </p>
    );

  /* ======================================
     UI
  ====================================== */

  return (
    <div className="min-h-screen flex flex-col items-center py-16 px-6">
      <h1 className="text-3xl font-semibold mb-8">
        🎯 MCQ Challenge
      </h1>

      <p className="mb-4 text-lg">
        ❤️ Lives: {lives}
      </p>

      <p className="mb-8 text-lg">
        ⭐ XP: {arcadeState.score} | 🔥 Streak: {arcadeState.streak}
      </p>

      <div className="max-w-2xl w-full">
        <h2 className="text-xl font-medium mb-8">
          {current.question}
        </h2>

        <div className="flex flex-col gap-4">
          {current.options.map((option, i) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === current.answer;

            let bgClass = "";

            if (selectedOption) {
              if (isCorrect)
                bgClass = "bg-green-200";
              else if (isSelected)
                bgClass = "bg-red-200";
              else
                bgClass = "opacity-70";
            }

            return (
              <Card
                key={i}
                onClick={() => handleOptionClick(option)}
                className={`
                  cursor-pointer
                  transition-all duration-300
                  hover:scale-105
                  ${bgClass}
                `}
              >
                <CardContent className="p-4 text-left">
                  {option}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}