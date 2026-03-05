"use client";

import { useEffect, useState } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";
import { soundManager } from "@/utils/soundManager";
import Image from "next/image";

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
  const [mascotComment, setMascotComment] = useState("");

  // 🎵 Background music
  useEffect(() => {
    soundManager.playBackground();
    return () => {
      soundManager.stopBackground();
    };
  }, []);

  // Load questions
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
    if (!input.trim()) return;

    soundManager.playClick();

    const current = questions[index];
    const correct =
      input.trim().toLowerCase() ===
      current.answer.toLowerCase();

    if (correct) {
      soundManager.playCorrect();
      setMascotComment("You unlocked genius mode ✨");
      setFeedback("Correct!");
    } else {
      soundManager.playWrong();
      setMascotComment("Almost there. Brain sparkles recalibrating.");
      setFeedback(`Correct answer: ${current.answer}`);
    }

    setTimeout(() => {
      setInput("");
      setFeedback("");
      setMascotComment("");
      setIndex((i) => i + 1);
    }, 1700);
  }

  if (loading)
    return <ProgressLoader label="Generating Fill Game..." />;

  const current = questions[index];

  if (!current)
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-2.png')" }}
      >
        <div className="bg-white/70 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center border border-pink-200">
          <h2 className="text-3xl font-bold text-pink-600">
            Level Complete 🎉
          </h2>
          <p className="mt-3 text-gray-600">
            You dominated this round.
          </p>
        </div>
      </div>
    );

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-2.png')" }}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-2xl bg-white/60 backdrop-blur-xl
        rounded-3xl shadow-2xl border border-pink-200
        p-10 space-y-8 text-center"
      >
        {/* Question */}
        <div className="bg-pink-100/70 border border-pink-200 p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-pink-700 leading-relaxed">
            {current.question}
          </h2>
        </div>

        {/* Input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          className="w-full p-6 rounded-2xl 
          bg-white/80 backdrop-blur-sm
          border-2 border-pink-200
          focus:outline-none focus:ring-4 focus:ring-pink-200
          text-center text-xl text-pink-700"
        />

        {/* Button + Hearts */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={submit}
            className="px-10 py-4 rounded-2xl 
            bg-pink-300 hover:bg-pink-400
            text-white text-lg font-semibold
            shadow-lg hover:scale-105
            transition-all duration-300"
          >
            Submit
          </button>

          {/* Hearts */}
          <div className="flex gap-2">
            
            <Image src="/images/arcade/hearts.gif" alt="heart" width={32} height={32} />
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="text-lg font-medium text-purple-700">
            {feedback}
          </div>
        )}
      </div>

      {/* Mascot */}
      <div className="absolute right-8 bottom-8 flex flex-col items-center">
        <Image
          src="/images/arcade/mascot-comment.png"
          alt="Mascot"
          width={140}
          height={140}
          className="drop-shadow-2xl"
        />

        {mascotComment && (
          <div
            className="mt-4 bg-pink-100/90 backdrop-blur-md
            px-5 py-3 rounded-2xl
            text-sm text-pink-700
            shadow-lg border border-pink-200
            max-w-[220px] text-center"
          >
            {mascotComment}
          </div>
        )}
      </div>
    </div>
  );
}