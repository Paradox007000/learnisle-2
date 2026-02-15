// ======================================
// 🎮 ARCADE ENGINE (CORE GAME SYSTEM)
// Shared logic for ALL arcade games
// ======================================

/* -----------------------------
   GAME RESULT TYPES
----------------------------- */

export type GameResult = {
  correct: boolean;
  timeTaken?: number;
};

/* -----------------------------
   GLOBAL ARCADE STATE
----------------------------- */

export type ArcadeState = {
  score: number;
  lives: number;
  streak: number;
};

export const DEFAULT_STATE: ArcadeState = {
  score: 0,
  lives: 5,
  streak: 0,
};

/* -----------------------------
   CORE SCORING ENGINE
----------------------------- */

export function processGameResult(
  state: ArcadeState,
  result: GameResult
): ArcadeState {
  const newState = { ...state };

  if (result.correct) {
    // base points
    newState.score += 10;

    // streak increase
    newState.streak += 1;

    // streak bonus every 5 correct
    if (newState.streak % 5 === 0) {
      newState.score += 20;
    }
  } else {
    newState.lives = Math.max(0, newState.lives - 1);
    newState.streak = 0;
  }

  return newState;
}

/* -----------------------------
   QUESTION TYPES (SHARED)
----------------------------- */

export type SpeedQuestion = {
  question: string;
  answer: string;
};

export type MCQQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type FillBlankQuestion = {
  sentence: string;
  answer: string;
};

export type MemoryPair = {
  concept: string;
  meaning: string;
};

/* -----------------------------
   UTILITY HELPERS
----------------------------- */

export function normalizeAnswer(text: string) {
  return text.trim().toLowerCase();
}

export function checkAnswer(
  userInput: string,
  correctAnswer: string
) {
  return (
    normalizeAnswer(userInput) ===
    normalizeAnswer(correctAnswer)
  );
}
