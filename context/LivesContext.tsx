"use client";

import { createContext, useContext, useEffect, useState } from "react";

type LivesContextType = {
  lives: number;
  maxLives: number;
  addLife: () => void;
  loseLife: () => void;
  resetLives: () => void;
};

const LivesContext = createContext<LivesContextType | null>(null);

export function LivesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const maxLives = 3;
  const [lives, setLives] = useState(3);

  // load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("learnisle_lives");
    if (saved) setLives(Number(saved));
  }, []);

  // save automatically
  useEffect(() => {
    localStorage.setItem("learnisle_lives", String(lives));
  }, [lives]);

  function addLife() {
    setLives((l) => Math.min(maxLives, l + 1));
  }

  function loseLife() {
    setLives((l) => Math.max(0, l - 1));
  }

  function resetLives() {
    setLives(maxLives);
  }

  return (
    <LivesContext.Provider
      value={{ lives, maxLives, addLife, loseLife, resetLives }}
    >
      {children}
    </LivesContext.Provider>
  );
}

export function useLives() {
  const ctx = useContext(LivesContext);
  if (!ctx) throw new Error("useLives must be inside LivesProvider");
  return ctx;
}