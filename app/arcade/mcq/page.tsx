"use client";

import { useEffect, useState } from "react";
import ProgressLoader from "@/components/ui/ProgressLoader";
import { soundManager } from "@/utils/soundManager";
import Image from "next/image";
import useArcadeGame from "@/hooks/useArcadeGame";

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
  const [feedback, setFeedback] = useState("");
  const [mascotComment, setMascotComment] = useState("");

  const { registerWrong, finishGame } = useArcadeGame(questions.length);

  useEffect(() => {
    soundManager.playBackground();
    return () => soundManager.stopBackground();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/arcade/mcq");
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error("MCQ fetch failed", err);
        setQuestions([]);
      }

      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    if (!loading && index >= questions.length && questions.length > 0) {
      finishGame();
    }
  }, [index, questions.length, loading]);

  function handleOptionClick(option: string) {
    if (selectedOption) return;

    soundManager.playClick();

    const current = questions[index];
    const correct = option === current.answer;

    setSelectedOption(option);

    if (correct) {
      soundManager.playCorrect();
      setMascotComment("Sharp brain detected ✨");
      setFeedback("Correct!");
    } else {
      soundManager.playWrong();
      registerWrong();   // ❤️ track wrong
      setMascotComment("Almost! Try the next one.");
      setFeedback(`Correct answer: ${current.answer}`);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setFeedback("");
      setMascotComment("");
      setIndex((i) => i + 1);
    }, 1700);
  }

  if (loading)
    return <ProgressLoader label="Generating MCQs..." />;

  const current = questions[index];

  if (!current)
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/bg-2.png')" }}>
        <div className="bg-white/70 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center border border-pink-200">
          <h2 className="text-3xl font-bold text-pink-600">Level Complete 🎉</h2>
          <p className="mt-3 text-gray-600">You finished all 5 questions.</p>
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-cover bg-center" style={{ backgroundImage: "url('/bg-2.png')" }}>
      <div className="relative w-full max-w-2xl bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200 p-10 space-y-8 text-center">
        
        <div className="bg-pink-100/70 border border-pink-200 p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-pink-700">
            {current.question}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {current.options.map((option, i) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === current.answer;

            let style = "bg-white";

            if (selectedOption) {
              if (isCorrect) style = "bg-green-200";
              else if (isSelected) style = "bg-red-200";
              else style = "opacity-60";
            }

            return (
              <button
                key={i}
                onClick={() => handleOptionClick(option)}
                className={`p-5 rounded-xl border border-pink-200 ${style} hover:scale-105 transition`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Image src="/images/arcade/hearts.gif" alt="heart" width={32} height={32}/>
        </div>

        {feedback && (
          <div className="text-lg font-medium text-purple-700">
            {feedback}
          </div>
        )}
      </div>

      <div className="absolute right-8 bottom-8 flex flex-col items-center">
        <Image src="/images/arcade/mascot-comment.png" alt="Mascot" width={140} height={140}/>
        {mascotComment && (
          <div className="mt-4 bg-pink-100 px-5 py-3 rounded-2xl text-sm text-pink-700 shadow-lg border border-pink-200 max-w-[220px] text-center">
            {mascotComment}
          </div>
        )}
      </div>
    </div>
  );
}