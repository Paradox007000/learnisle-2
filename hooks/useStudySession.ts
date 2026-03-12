"use client";

import { useStudy } from "@/context/StudyContext";

export default function useStudySession() {
  const { secondsLeft } = useStudy();

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    secondsLeft,
    formattedTime,
  };
}