"use client";

import { useEffect, useState } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";


export default function MCQGame() {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [stats, setStats] = useState<any>(null);

  async function loadQuestion() {
    setLoading(true);

    const res = await fetch("/api/arcade/mcq");
    const data = await res.json();

    setQuestion(data.question);
    setOptions(data.options);
    setAnswer(data.answer);

    setSelected(null);
    setResult("");
    setLoading(false);
  }

  useEffect(() => {
    loadQuestion();
  }, []);

  async function choose(option: string) {
    if (selected) return;

    setSelected(option);

    const correct = option === answer;

    const res = await fetch("/api/arcade/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correct }),
    });

    const data = await res.json();
    setStats(data.state);

    setResult(correct ? "✅ Correct!" : "❌ Wrong");
  }

  if (loading)
  return <ProgressLoader label="⚡ Generating..." />;


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
      <h2>{question}</h2>

      <div style={{ marginTop: 20 }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => choose(opt)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: 12,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #eee",
              cursor: "pointer",
              background:
                selected === opt
                  ? opt === answer
                    ? "#d4ffd9"
                    : "#ffd6d6"
                  : "white",
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>{result}</h3>

          <button
            onClick={loadQuestion}
            style={{
              marginTop: 10,
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(135deg,#ff9ebb,#9edbff)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Next Question →
          </button>
        </div>
      )}

      {stats && (
        <div style={{ marginTop: 25 }}>
          <p>⭐ Score: {stats.score}</p>
          <p>❤️ Lives: {stats.lives}</p>
          <p>🔥 Streak: {stats.streak}</p>
        </div>
      )}
    </div>
  );
}
