"use client";

import { useEffect, useState } from "react";

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

  // -----------------------------
  // Fetch questions
  // -----------------------------
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/arcade/speed");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  // -----------------------------
  // Timer
  // -----------------------------
  useEffect(() => {
    if (loading || finished) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          nextQuestion();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index, finished, loading]);

  // -----------------------------
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

  async function finishGame() {
    setFinished(true);

    await fetch("/api/arcade/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game: "speed",
        score,
      }),
    });
  }

  // -----------------------------
  // UI STATES
  // -----------------------------
  if (loading)
    return (
      <div className="center">
        <div className="card">
          <h2>⚡ Preparing Speed Recall...</h2>
          <p>Generating AI questions from your notes</p>
        </div>
      </div>
    );

  if (finished)
    return (
      <div className="center">
        <div className="card">
          <h1>🎉 Finished!</h1>
          <h2>Your Score: {score}</h2>
        </div>
      </div>
    );

  const current = questions[index];
  const progress =
    ((index + 1) / questions.length) * 100;

  return (
    <div className="center">
      <div className="gameCard">
        {/* Header */}
        <div className="header">
          <h1>⚡ Speed Recall</h1>

          <div className="stats">
            <span>⏱ {time}s</span>
            <span>⭐ {score}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress">
          <div
            className="progressFill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="question">
          {current.question}
        </h2>

        {/* Input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type answer quickly..."
          className="input"
        />

        {/* Button */}
        <button
          onClick={nextQuestion}
          className="submitBtn"
        >
          Submit →
        </button>

        <p className="counter">
          Question {index + 1} / {questions.length}
        </p>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .center {
          min-height: 80vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(
            180deg,
            #f8fbff,
            #fdf7ff
          );
          padding: 20px;
        }

        .gameCard {
          width: 100%;
          max-width: 620px;
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
        }

        .card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stats {
          display: flex;
          gap: 16px;
          font-weight: 600;
          color: #555;
        }

        .progress {
          height: 8px;
          background: #eee;
          border-radius: 999px;
          margin: 20px 0;
          overflow: hidden;
        }

        .progressFill {
          height: 100%;
          background: linear-gradient(
            90deg,
            #ff9ebb,
            #9edbff
          );
          transition: width 0.3s ease;
        }

        .question {
          font-size: 22px;
          margin: 25px 0;
          text-align: center;
        }

        .input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid #ddd;
          font-size: 16px;
          outline: none;
          transition: 0.2s;
        }

        .input:focus {
          border-color: #9edbff;
          box-shadow: 0 0 0 3px rgba(158, 219, 255, 0.2);
        }

        .submitBtn {
          width: 100%;
          margin-top: 20px;
          padding: 14px;
          border: none;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          color: white;
          background: linear-gradient(
            135deg,
            #ff9ebb,
            #9edbff
          );
          transition: 0.2s;
        }

        .submitBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        .counter {
          text-align: center;
          margin-top: 14px;
          color: #777;
        }
      `}</style>
    </div>
  );
}
