// ======================================
// 🎮 ARCADE ENGINE (CORE GAME SYSTEM)
// Shared logic for ALL arcade games
// ======================================

/* =====================================================
   GAME RESULT TYPES
===================================================== */

export type GameResult = {
  correct: boolean;
  timeTaken?: number; // optional for speed games
};

/* =====================================================
   GLOBAL ARCADE STATE
===================================================== */

export type ArcadeState = {
  score: number;
  lives: number;
  streak: number;
};

export const MAX_LIVES = 5;

export const DEFAULT_STATE: ArcadeState = {
  score: 0,
  lives: MAX_LIVES,
  streak: 0,
};

/* =====================================================
   CORE SCORING ENGINE
===================================================== */

export function processGameResult(
  state: ArcadeState,
  result: GameResult
): ArcadeState {
  const newState: ArcadeState = { ...state };

  // ============================
  // ✅ CORRECT ANSWER
  // ============================
  if (result.correct) {
    let points = 10;

    // ⚡ Speed bonus (for recall games)
    if (result.timeTaken !== undefined) {
      if (result.timeTaken < 2) points += 10;
      else if (result.timeTaken < 4) points += 5;
    }

    newState.score += points;

    // increase streak
    newState.streak += 1;

    // 🔥 streak bonus every 5
    if (newState.streak % 5 === 0) {
      newState.score += 20;
    }
  }

  // ============================
  // ❌ WRONG ANSWER
  // ============================
  else {
    newState.lives = Math.max(0, newState.lives - 1);
    newState.streak = 0;
  }

  return newState;
}

/* =====================================================
   LIFE RECOVERY SYSTEM
===================================================== */

export function recoverLives(
  state: ArcadeState,
  amount: number = 1
): ArcadeState {
  return {
    ...state,
    lives: Math.min(MAX_LIVES, state.lives + amount),
  };
}

/* =====================================================
   RESET HELPERS
===================================================== */

export function resetArcade(): ArcadeState {
  return { ...DEFAULT_STATE };
}

export function resetStreak(
  state: ArcadeState
): ArcadeState {
  return {
    ...state,
    streak: 0,
  };
}

/* =====================================================
   QUESTION TYPES (SHARED ACROSS GAMES)
===================================================== */

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

/* =====================================================
   UTILITY HELPERS
===================================================== */

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