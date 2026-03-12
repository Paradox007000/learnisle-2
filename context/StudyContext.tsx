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

/* ⭐ 15 minutes */
const STUDY_TIME = 15 * 60;

export function StudyProvider({
children,
}: {
children: React.ReactNode;
}) {
const { gainLife } = useLives();
const pathname = usePathname();

const learningRoutes = [
"/document",
"/flashcards",
"/podcast",
];

const isLearningPage =
learningRoutes.some((route) =>
pathname.startsWith(route)
);

const [secondsLeft, setSecondsLeft] =
useState(STUDY_TIME);

const [showToast, setShowToast] =
useState(false);

useEffect(() => {
if (!isLearningPage) return;

const timer = setInterval(() => {
  setSecondsLeft((prev) => {
    if (prev <= 1) {

      // Delay life gain slightly to avoid React render warning
      setTimeout(() => {
        gainLife();
      }, 0);

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2500);

      return STUDY_TIME;
    }

    return prev - 1;
  });
}, 1000);

return () => clearInterval(timer);

}, [isLearningPage, gainLife]);

return (
<StudyContext.Provider
value={{ secondsLeft }}
>
{children}

  {isLearningPage && showToast && (
    <div style={toastStyle}>
      +1 Life Recovered ❤️
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