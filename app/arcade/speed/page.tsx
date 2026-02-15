"use client";

import { useEffect, useState } from "react";

type Question = {
  question: string;
  answer: string;
};

export default function SpeedRecallPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(5);
  const [finished, setFinished] = useState(false);

  // -------------------
  // LOAD QUESTIONS
  // -------------------
  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch("/api/speed");
        const data = await res.json();

        setQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  // -------------------
  // TIMER
  // -------------------
  useEffect(() => {
    if (loading || finished || questions.length === 0)
      return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          nextQuestion();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index, finished, loading, questions]);

  // -------------------
  // NEXT QUESTION
  // -------------------
  function nextQuestion() {
    const current = questions[index];

    if (
      input.trim().toLowerCase() ===
      current.answer.toLowerCase()
    ) {
      setScore((s) => s + 1);
    }

    setInput("");

    if (index + 1 >= questions.length) {
      finishGame();
    } else {
      setIndex((i) => i + 1);
      setTime(5);
    }
  }

  // -------------------
  // FINISH GAME
  // -------------------
  async function finishGame() {
    setFinished(true);

    await fetch("api/", {
      method: "POST",
      body: JSON.stringify({
        game: "speed",
        score,
      }),
    });
  }

  // -------------------
  // UI STATES
  // -------------------

  if (loading)
    return <p>🧠 Generating questions from your notes...</p>;

  if (questions.length === 0)
    return <p>No study notes found.</p>;

  if (finished)
    return (
      <div>
        <h1>⚡ Speed Recall Complete</h1>
        <h2>Your Score: {score}</h2>
      </div>
    );

  const current = questions[index];

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>⚡ Speed Recall</h1>

      <h3>⏱ {time}s</h3>

      <h2>{current.question}</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type answer fast..."
        style={{
          padding: "10px",
          width: "100%",
          marginTop: "20px",
        }}
      />

      <button
        onClick={nextQuestion}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
        }}
      >
        Submit
      </button>

      <p>
        Question {index + 1} / {questions.length}
      </p>

      <p>Score: {score}</p>
    </div>
  );
}
