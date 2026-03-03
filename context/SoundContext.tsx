"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type SoundContextType = {
  volume: number;
  setVolume: (v: number) => void;
  bgMuted: boolean;
  setBgMuted: (m: boolean) => void;
  playClick: () => void;
  playCorrect: () => void;
  playWrong: () => void;
};

const SoundContext = createContext<SoundContextType | null>(
  null
);

export function SoundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [volume, setVolume] = useState(0.3);
  const [bgMuted, setBgMuted] = useState(false);

  const bgRef = useRef<HTMLAudioElement | null>(null);
  const clickRef = useRef<HTMLAudioElement | null>(null);
  const correctRef = useRef<HTMLAudioElement | null>(null);
  const wrongRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgRef.current = new Audio("/sounds/bg-music.mp3");
    bgRef.current.loop = true;
    bgRef.current.volume = volume;
    bgRef.current.play();

    clickRef.current = new Audio("/sounds/click.mp3");
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");

    return () => {
      bgRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (bgRef.current) bgRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!bgRef.current) return;

    if (bgMuted) bgRef.current.pause();
    else bgRef.current.play();
  }, [bgMuted]);

  function play(sound: HTMLAudioElement | null) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.volume = volume;
    sound.play();
  }

  return (
    <SoundContext.Provider
      value={{
        volume,
        setVolume,
        bgMuted,
        setBgMuted,
        playClick: () => play(clickRef.current),
        playCorrect: () => play(correctRef.current),
        playWrong: () => play(wrongRef.current),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx)
    throw new Error("useSound must be inside SoundProvider");
  return ctx;
}