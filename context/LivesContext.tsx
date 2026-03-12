"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type LivesContextType = {
  lives: number;
  loseLife: () => void;
  gainLife: () => void;
  resetLives: () => void;
  isArcadePage: boolean;
};

const MAX_LIVES = 5;

const LivesContext =
  createContext<LivesContextType | null>(null);

export function LivesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isArcadePage =
    pathname.startsWith("/arcade");

  const [lives, setLives] =
    useState(MAX_LIVES);

  function loseLife() {
    setLives((prev) =>
      Math.max(0, prev - 1)
    );
  }

  function gainLife() {
    setLives((prev) =>
      Math.min(MAX_LIVES, prev + 1)
    );
  }

  function resetLives() {
    setLives(MAX_LIVES);
  }

  return (
    <LivesContext.Provider
      value={{
        lives,
        loseLife,
        gainLife,
        resetLives,
        isArcadePage,
      }}
    >
      {children}
    </LivesContext.Provider>
  );
}

export function useLives() {
  const context = useContext(LivesContext);

  if (!context)
    throw new Error(
      "useLives must be inside LivesProvider"
    );

  return context;
}