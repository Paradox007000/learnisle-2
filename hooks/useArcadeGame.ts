"use client";

import { useRef } from "react";
import { useLives } from "@/context/LivesContext";

export default function useArcadeGame(totalQuestions: number) {
  const { loseLife } = useLives();

  const wrongCount = useRef(0);
  const finished = useRef(false);

  function registerWrong() {
    wrongCount.current += 1;
  }

  function finishGame() {
    if (finished.current) return; // prevents double trigger
    finished.current = true;

    if (wrongCount.current > 0) {
      loseLife();
    }
  }

  return {
    registerWrong,
    finishGame,
  };
}