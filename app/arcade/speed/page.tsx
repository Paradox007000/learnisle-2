"use client";

import { useEffect, useState, useRef } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";
import { soundManager } from "@/utils/soundManager";
import Image from "next/image";

type Question = {
  question: string;
  answer: string;
};

export default function SpeedRecallPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [time, setTime] = useState(5);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [mascotComment, setMascotComment] = useState("");

  const answeringRef = useRef(false);

  // 🎵 Background Music
  useEffect(() => {
    soundManager.playBackground();
    return () => {
      soundManager.stopBackground();
    };
  }, []);

  // Load questions
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/arcade/speed");
      const data = await res.json();
      setQuestions(data.questions || []);
      setLoading(false);
    }
    load();
  }, []);

  // Timer
  useEffect(() => {
    if (loading || finished) return;

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, finished, index]);

  // When time runs out
  useEffect(() => {
    if (time <= 0 && !finished) {
      handleAnswer(false);
    }
  }, [time]);

  function handleAnswer(correct: boolean) {
    if (answeringRef.current) return;
    answeringRef.current = true;

    if (correct) {
      soundManager.playCorrect();
      setMascotComment("Speed brain activated ⚡");
    } else {
      soundManager.playWrong();
      setMascotComment("Too slow! Stay focused 💭");
    }

    setTimeout(() => {
      answeringRef.current = false;

      if (index + 1 >= questions.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setTime(5);
        setInput("");
        setMascotComment("");
      }
    }, 800);
  }

  function nextQuestion() {
    if (!input.trim()) return;

    soundManager.playClick();

    const current = questions[index];
    const correct =
      input.trim().toLowerCase() ===
      current.answer.trim().toLowerCase();

    handleAnswer(correct);
  }

  if (loading)
    return <ProgressLoader label="Generating Speed Recall..." />;

  if (finished)
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-2.png')" }}
      >
        <div className="bg-white/80 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center border border-pink-200">
          <h2 className="text-3xl font-bold text-pink-600">
            Speed Round Complete 💖
          </h2>
          <p className="mt-3 text-gray-600">
            Your reflexes were impressive.
          </p>
        </div>
      </div>
    );

  const current = questions[index];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-2.png')" }}
    >
      {/* Decorative Hearts (UI only) */}
      <div className="absolute top-6 left-6 flex gap-2">
        <Image src="/images/arcade/heart.png" alt="heart" width={30} height={30} />
        <Image src="/images/arcade/heart.png" alt="heart" width={30} height={30} />
        <Image src="/images/arcade/heart.png" alt="heart" width={30} height={30} />
      </div>

      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl 
                      rounded-3xl shadow-2xl border border-pink-200 
                      p-12 space-y-10 text-center">

        <div className="text-pink-600 text-2xl font-semibold">
          ⏳ {time}s Remaining
        </div>

        <div className="bg-pink-100/70 backdrop-blur-md 
                        p-10 rounded-2xl shadow-inner 
                        border border-pink-200">
          <h2 className="text-2xl font-semibold text-pink-700">
            {current?.question}
          </h2>
        </div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && nextQuestion()}
          placeholder="Answer quickly..."
          className="w-full p-6 rounded-2xl border-2 border-pink-300 
                     focus:outline-none focus:ring-4 focus:ring-pink-200
                     text-center text-xl text-pink-700"
        />

        <button
          onClick={nextQuestion}
          className="px-12 py-5 rounded-2xl 
                     bg-gradient-to-r from-pink-400 to-purple-400 
                     text-white text-lg font-semibold 
                     shadow-lg hover:scale-105 
                     transition-all duration-300 mt-4"
        >
          Submit
        </button>
      </div>

      {/* Mascot */}
      <div className="absolute right-8 bottom-6 flex flex-col items-center">
        <Image
          src="/images/arcade/mascot-comment.png"
          alt="Mascot"
          width={160}
          height={160}
          priority
          className="drop-shadow-2xl"
        />

        {mascotComment && (
          <div className="mt-4 bg-pink-100 px-6 py-3 rounded-2xl 
                          text-sm text-pink-700 shadow-lg 
                          max-w-[240px] text-center">
            {mascotComment}
          </div>
        )}
      </div>
    </div>
  );
}