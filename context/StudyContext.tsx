"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLives } from "./LivesContext";
import { usePathname } from "next/navigation";

type StudyContextType = {
  secondsLeft: number;
};

const StudyContext =
  createContext<StudyContextType | null>(null);

/* ⭐ DEMO MODE
   30 minutes → 30 seconds
*/
const STUDY_TIME = 30;

export function StudyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gainLife } = useLives();
  const pathname = usePathname();

  const isArcadePage =
    pathname.startsWith("/arcade");

  const [secondsLeft, setSecondsLeft] =
    useState(STUDY_TIME);
  const [showToast, setShowToast] =
    useState(false);

  useEffect(() => {
    // 🚫 STOP study timer on arcade page
    if (isArcadePage) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          gainLife(); // ❤️ reward life
          setShowToast(true);

          setTimeout(
            () => setShowToast(false),
            2500
          );

          return STUDY_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gainLife, isArcadePage]);

  return (
    <StudyContext.Provider
      value={{ secondsLeft }}
    >
      {children}

      {/* ⭐ Reward Toast (hidden on arcade) */}
      {!isArcadePage && showToast && (
        <div style={toastStyle}>
          +1 Life Recovered!
        </div>
      )}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx)
    throw new Error(
      "useStudy must be inside StudyProvider"
    );
  return ctx;
}

const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  background: "#ffffff",
  padding: "14px 20px",
  borderRadius: "14px",
  boxShadow:
    "0 10px 25px rgba(0,0,0,0.15)",
  fontWeight: 600,
  zIndex: 999999,
};