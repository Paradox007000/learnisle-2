"use client";

import { useEffect, useState, useRef } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";
import { useLives } from "@/context/LivesContext";
import { soundManager } from "@/utils/soundManager";

type Question = {
  question: string;
  answer: string;
};

export default function SpeedRecallPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(5);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const { loseLife, lives } = useLives();
  const answeringRef = useRef(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/arcade/speed");
      const data = await res.json();
      setQuestions(data.questions);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (loading || finished) return;
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [loading, finished, index]);

  useEffect(() => {
    if (time <= 0 && !loading && !finished) {
      handleAnswer(false);
    }
  }, [time]);

  function handleAnswer(correct: boolean) {
    if (answeringRef.current) return;
    answeringRef.current = true;

    if (correct) {
      soundManager.playCorrect();
      setScore((s) => s + 1);
    } else {
      soundManager.playWrong();
      loseLife();
    }

    setInput("");

    setTimeout(() => {
      answeringRef.current = false;

      if (index + 1 >= questions.length || lives <= 1) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setTime(5);
      }
    }, 150);
  }

  function nextQuestion() {
    soundManager.playClick();

    const current = questions[index];

    const correct =
      input.trim().toLowerCase() ===
      current.answer.trim().toLowerCase();

    handleAnswer(correct);
  }

  if (loading)
    return <ProgressLoader label="⚡ Generating questions..." />;

  if (finished)
    return (
      <div className="text-center mt-20">
        <h1>🎉 Finished!</h1>
        <h2>Your Score: {score}</h2>
      </div>
    );

  const current = questions[index];

  return (
    <div className="max-w-xl mx-auto mt-16">
      <h1>⚡ Speed Recall</h1>

      <p>⏱ {time}s | ⭐ {score} | ❤️ {lives}</p>

      <h2 className="mt-6">{current.question}</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && nextQuestion()}
        className="w-full border p-3 mt-4"
      />

      <button
        onClick={nextQuestion}
        className="mt-4 px-6 py-3 bg-black text-white"
      >
        Submit →
      </button>
    </div>
  );
}