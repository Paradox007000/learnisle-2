"use client";

import TopBar from "@/components/ui/TopBar";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Home,
  Gamepad2,
  FileText,
  Mic,
  CreditCard,
  User,
} from "lucide-react";

/* ---------------- CLEAN MARKDOWN ---------------- */
function cleanForSpeech(text: string) {
  return text
    .replace(/\\/g, "")
    .replace(/\*/g, "")
    .replace(/^- /gm, "")
    .replace(/^• /gm, "")
    .replace(/^#+\s/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export default function PodcastPage() {
  const captionRef = useRef<HTMLDivElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Preparing podcast...");
  const [captions, setCaptions] = useState("");
  const [playing, setPlaying] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* ⭐ NEW: language toggle */
  const [language, setLanguage] = useState<"en" | "hi">("en");

  /* ---------------- LOAD PODCAST ---------------- */
  useEffect(() => {
    const loadPodcast = async () => {
      try {
        setLoading(true);
        setStatus("Preparing podcast...");

        const res = await fetch("/api/get-notes");
        if (!res.ok) throw new Error("No notes");

        const { notes } = await res.json();

        let finalText = notes;

        /* ⭐ TRANSLATE IF HINDI SELECTED */
        if (language === "hi") {
          const translateRes = await fetch(
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=" +
              encodeURIComponent(notes)
          );

          const data = await translateRes.json();
          finalText = data[0].map((t: any) => t[0]).join("");
        }

        setCaptions(finalText);

        const cleanText = cleanForSpeech(finalText);
        const wordArray = cleanText.split(/\s+/);
        setWords(wordArray);

        const speech = new SpeechSynthesisUtterance(cleanText);

        /* ⭐ VOICE SELECTION */
        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();

          let selected;

          if (language === "hi") {
            selected =
              voices.find((v) => v.lang.includes("hi")) ||
              voices.find((v) =>
                v.name.toLowerCase().includes("hindi")
              );
          } else {
            selected =
              voices.find((v) =>
                v.name.toLowerCase().includes("female")
              ) ||
              voices.find((v) => v.lang.includes("en"));
          }

          if (selected) speech.voice = selected;
        };

        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;

        speech.rate = 0.95;
        speech.pitch = 1.1;

        speech.onstart = () => {
          setLoading(false);
          setPlaying(true);
          setStatus("Now Playing");
        };

        speech.onboundary = (event) => {
          if (event.name === "word") {
            const spoken = cleanText.substring(0, event.charIndex);
            const index = spoken.split(/\s+/).length - 1;
            setCurrentWordIndex(index);
          }
        };

        speech.onend = () => {
          setPlaying(false);
          setStatus("Podcast Finished");
        };

        utteranceRef.current = speech;

        setTimeout(() => speechSynthesis.speak(speech), 400);
      } catch {
        setStatus("No notes available");
        setLoading(false);
      }
    };

    loadPodcast();

    return () => {
      speechSynthesis.cancel();
    };
  }, [language]);

  /* ---------------- PLAY / PAUSE ---------------- */
  const togglePlay = () => {
    if (!utteranceRef.current) return;

    if (playing) {
      speechSynthesis.pause();
      setPlaying(false);
    } else {
      speechSynthesis.resume();
      setPlaying(true);
    }
  };

  /* AUTO SCROLL CAPTIONS */
  useEffect(() => {
    const el = captionRef.current;
    if (!el) return;

    const active = el.querySelector(".activeWord");
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentWordIndex]);

  return (
    <div className="page">
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {/* ⭐ LANGUAGE TOGGLE */}
      <div className="langSwitch">
        <button
          className={language === "en" ? "activeLang" : ""}
          onClick={() => setLanguage("en")}
        >
          English
        </button>

        <button
          className={language === "hi" ? "activeLang" : ""}
          onClick={() => setLanguage("hi")}
        >
          हिंदी
        </button>
      </div>

      <div className="centerWrap">
        <div className="card">
          <img src="/mascot.png" className="mascot" />

          <h2 className="status">{status}</h2>

          {!loading && (
            <button className="playButton" onClick={togglePlay}>
              {playing ? <Pause size={22} /> : <Play size={22} />}
            </button>
          )}

          {!loading && (
            <div ref={captionRef} className="captions">
              {words.map((word, i) => (
                <span
                  key={i}
                  className={
                    i === currentWordIndex ? "activeWord" : ""
                  }
                >
                  {word}{" "}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff5fa, #eef9ff);
        }

        .langSwitch {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }

        .langSwitch button {
          border: none;
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          background: #eee;
          font-weight: 600;
        }

        .activeLang {
          background: #ff7aa8;
          color: white;
        }

        .centerWrap {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          padding: 40px 20px;
        }

        .card {
          width: 100%;
          max-width: 1000px;
          background: white;
          border-radius: 40px;
          padding: 70px 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          box-shadow: 0 40px 100px rgba(255, 94, 149, 0.12);
          text-align: center;
        }

        .mascot {
          width: 150px;
        }

        .status {
          font-size: 22px;
          font-weight: 600;
          color: #333;
        }

        .playButton {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #ff7aa8, #ff4f91);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .captions {
          width: 100%;
          height: 260px;
          overflow-y: auto;
          background: #f8fbff;
          padding: 28px;
          border-radius: 20px;
          line-height: 1.9;
          font-size: 15px;
          border: 1px solid #eef2f7;
        }

        .activeWord {
          background: #ff7aa8;
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}