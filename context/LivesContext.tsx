"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type LivesContextType = {
  lives: number;
  nextLifeIn: number;
  loseLife: () => void;
  gainLife: () => void;
  resetLives: () => void;
  isArcadePage: boolean; // 👈 added
};

const MAX_LIVES = 5;

/* Demo: 30 seconds */
const REFILL_TIME = 30 * 1000;

const LivesContext =
  createContext<LivesContextType | null>(null);

export function LivesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isArcadePage = pathname.startsWith("/arcade");

  const [lives, setLives] = useState(MAX_LIVES);
  const [nextLifeIn, setNextLifeIn] =
    useState(REFILL_TIME / 1000);

  /* -------------------------
     LIFE REFILL TIMER
  ------------------------- */
  useEffect(() => {
    if (lives >= MAX_LIVES) return;

    const interval = setInterval(() => {
      setNextLifeIn((prev) => {
        if (prev <= 1) {
          setLives((l) =>
            Math.min(MAX_LIVES, l + 1)
          );
          return REFILL_TIME / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lives]);

  /* -------------------------
     ACTIONS
  ------------------------- */

  function loseLife() {
    setLives((prev) => {
      if (prev === MAX_LIVES) {
        setNextLifeIn(REFILL_TIME / 1000);
      }
      return Math.max(0, prev - 1);
    });
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
        nextLifeIn,
        loseLife,
        gainLife,
        resetLives,
        isArcadePage, // 👈 exposed
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