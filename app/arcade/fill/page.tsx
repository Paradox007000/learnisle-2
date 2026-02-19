"use client";

import { useEffect, useState } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";


type Question = {
  question: string;
  answer: string;
};

export default function FillGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");

  // -----------------------------
  // Load questions
  // -----------------------------
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/arcade/fill");
      const data = await res.json();

      setQuestions(data.questions || []);
      setLoading(false);
    }

    load();
  }, []);

  function submit() {
    const current = questions[index];

    const correct =
      input.trim().toLowerCase() ===
      current.answer.toLowerCase();

    if (correct) {
      setScore((s) => s + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Correct: ${current.answer}`);
    }

    setTimeout(() => {
      setFeedback("");
      setInput("");

      if (index + 1 >= questions.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 1200);
  }

 if (loading)
  return <ProgressLoader label="Generating..." />;


  if (finished)
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <h1>✏️ Game Complete</h1>
        <h2>Score: {score}</h2>
      </div>
    );

  const current = questions[index];

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "60px auto",
        background: "white",
        padding: 30,
        borderRadius: 20,
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
      }}
    >
      <h2>{current.question}</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type missing word..."
        style={{
          marginTop: 20,
          width: "100%",
          padding: 14,
          borderRadius: 12,
          border: "1px solid #eee",
        }}
      />

      <button
        onClick={submit}
        style={{
          marginTop: 20,
          padding: "12px 24px",
          borderRadius: 999,
          border: "none",
          background:
            "linear-gradient(135deg,#ff9ebb,#9edbff)",
          color: "white",
          cursor: "pointer",
        }}
      >
        Submit
      </button>

      {feedback && (
        <h3 style={{ marginTop: 20 }}>{feedback}</h3>
      )}

      <p style={{ marginTop: 20 }}>
        Question {index + 1} / {questions.length}
      </p>

      <p>⭐ Score: {score}</p>
    </div>
  );
}

