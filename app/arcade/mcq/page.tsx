"use client";

import { useEffect, useState } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";
import { DEFAULT_STATE, processGameResult, ArcadeState } from "@/lib/arcade/arcadeEngine";
import { useLives } from "@/context/LivesContext";
import { soundManager } from "@/utils/soundManager";
import { Card, CardContent } from "@/components/ui/card";

type MCQ = {
  question: string;
  options: string[];
  answer: string;
};

export default function MCQGame() {
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(false);

  const [arcadeState, setArcadeState] = useState<ArcadeState>(DEFAULT_STATE);
  const { loseLife, lives } = useLives();

  /* ===============================
     LOAD QUESTIONS
  =============================== */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/arcade/mcq");
        const data = await res.json();

        if (!data.questions || data.questions.length === 0) {
          setError(true);
        } else {
          setQuestions(data.questions);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

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

  function handleOptionClick(option: string) {
    if (selectedOption || finished || lives === 0) return;

    soundManager.playClick();

    const current = questions[index];
    const correct = option === current.answer;

    setSelectedOption(option);
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

  /* ===============================
     STATES
  =============================== */

  if (loading) return <ProgressLoader label="Generating MCQs..." />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No questions generated. Please create notes first.</p>
      </div>
    );

  if (finished)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold mb-4">🎉 Level Complete!</h1>
        <p>⭐ XP: {arcadeState.score}</p>
        <p>🔥 Streak: {arcadeState.streak}</p>
      </div>
    );

  const current = questions[index];

  return (
    <div className="min-h-screen flex flex-col items-center py-16 px-6">
      <h1 className="text-3xl font-semibold mb-6">🎯 MCQ Challenge</h1>

      <p className="mb-4">❤️ Lives: {lives}</p>
      <p className="mb-8">⭐ XP: {arcadeState.score} | 🔥 {arcadeState.streak}</p>

      <div className="max-w-2xl w-full">
        <h2 className="text-xl font-medium mb-6">{current.question}</h2>

        <div className="flex flex-col gap-4">
          {current.options.map((option, i) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === current.answer;

            let bg = "bg-white";

            if (selectedOption) {
              if (isCorrect) bg = "bg-green-200";
              else if (isSelected) bg = "bg-red-200";
              else bg = "opacity-60";
            }

            return (
              <Card
                key={i}
                onClick={() => handleOptionClick(option)}
                className={`cursor-pointer transition-all ${bg}`}
              >
                <CardContent className="p-4">{option}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}