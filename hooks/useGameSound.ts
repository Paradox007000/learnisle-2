"use client";

import { useRef } from "react";

export function useGameSound(src: string, volume = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = volume;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return play;
}