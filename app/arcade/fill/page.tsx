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

type Question = {
  question: string;
  answer: string;
};

export default function FillGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  const [arcadeState, setArcadeState] =
    useState<ArcadeState>(DEFAULT_STATE);

  const { loseLife } = useLives();

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/arcade/fill");
      const data = await res.json();
      setQuestions(data.questions || []);
      setLoading(false);
    }
    load();
  }, []);

  function applyResult(correct: boolean) {
    setArcadeState((prev) => {
      const updated = processGameResult(prev, { correct });

      if (!correct) loseLife();

      return updated;
    });
  }

  function submit() {
    soundManager.playClick();

    const current = questions[index];

    const correct =
      input.trim().toLowerCase() ===
      current.answer.toLowerCase();

    if (correct) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    applyResult(correct);

    setFeedback(
      correct
        ? "✅ Correct!"
        : `❌ Correct answer: ${current.answer}`
    );

    setTimeout(() => {
      setInput("");
      setFeedback("");
      setIndex((i) => i + 1);
    }, 1200);
  }

  if (loading)
    return <ProgressLoader label="Generating Fill Game..." />;

  const current = questions[index];

  if (!current)
    return (
      <div className="text-center mt-20 text-xl">
        🎉 Level Complete!
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-16 px-6">
      <h2 className="text-2xl font-semibold mb-6">
        {current.question}
      </h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-4 border rounded-xl mb-4"
      />

      <button
        onClick={submit}
        className="px-6 py-3 rounded-xl bg-black text-white"
      >
        Submit
      </button>

      <p className="mt-4 text-lg">{feedback}</p>

      <p className="mt-8 text-lg">
        ⭐ XP: {arcadeState.score} | 🔥 Streak: {arcadeState.streak}
      </p>
    </div>
  );
}