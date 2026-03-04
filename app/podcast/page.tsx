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
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  useEffect(() => {
    const loadPodcast = async () => {
      try {
        setLoading(true);
        setStatus("Preparing podcast...");

        const res = await fetch("/api/get-notes");
        if (!res.ok) throw new Error("No notes");

        const { notes } = await res.json();
        let finalText = notes;

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
    <div
      className="page"
      style={{
        background: isDark
          ? "#1E1E1E"
          : "linear-gradient(135deg, #fff5fa, #eef9ff)",
      }}
    >
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {isMenuOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "300px",
              height: "100vh",
              background: isDark ? "#1E1E1E" : "white",
              zIndex: 999999,
              boxShadow: "5px 0 20px rgba(0,0,0,0.15)",
              padding: "30px 20px",
              color: isDark ? "white" : "#111",
            }}
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                fontSize: "28px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isDark ? "white" : "black",
              }}
            >
              ×
            </button>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginTop: "40px",
              }}
            >
              {[
                { href: "/dashboard", label: "Home", icon: <Home size={24} strokeWidth={2.5} color="#ec4899" /> },
                { href: "/arcade", label: "Arcade", icon: <Gamepad2 size={24} strokeWidth={2.5} color="#ec4899" /> },
                { href: "/document", label: "Document", icon: <FileText size={24} strokeWidth={2.5} color="#ec4899" /> },
                { href: "/podcast", label: "Podcast", icon: <Mic size={24} strokeWidth={2.5} color="#ec4899" /> },
                { href: "/flashcards", label: "Flashcards", icon: <CreditCard size={24} strokeWidth={2.5} color="#ec4899" /> },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "16px 18px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: isDark ? "white" : "#111",
                  }}
                >
                  {item.icon} {item.label}
                </Link>
              ))}

              <hr
                style={{
                  margin: "12px 0",
                  borderColor: isDark ? "#2A2A2A" : "#eee",
                }}
              />

              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px 18px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: isDark ? "white" : "#111",
                }}
              >
                <User size={24} strokeWidth={2.5} color="#ec4899" /> Account
              </Link>
            </div>
          </div>

          <div
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              zIndex: 99999,
            }}
          />
        </>
      )}

      <div className="langSwitch">
        <button
          onClick={() => setLanguage("en")}
          style={{
            background:
              language === "en"
                ? "#ff7aa8"
                : isDark
                ? "#2A2A2A"
                : "#eee",
            color:
              language === "en"
                ? "white"
                : isDark
                ? "white"
                : "#333",
          }}
        >
          English
        </button>

        <button
          onClick={() => setLanguage("hi")}
          style={{
            background:
              language === "hi"
                ? "#ff7aa8"
                : isDark
                ? "#2A2A2A"
                : "#eee",
            color:
              language === "hi"
                ? "white"
                : isDark
                ? "white"
                : "#333",
          }}
        >
          हिंदी
        </button>
      </div>

      <div className="centerWrap">
        <div
          className="card"
          style={{
            background: isDark ? "#2A2A2A" : "white",
            boxShadow: isDark
              ? "0 30px 80px rgba(0,0,0,0.6)"
              : "0 40px 100px rgba(255, 94, 149, 0.12)",
          }}
        >
          <img src="/mascot.png" className="mascot" />

          <h2 className="status" style={{ color: isDark ? "white" : "#333" }}>
            {status}
          </h2>

          {!loading && (
            <button className="playButton" onClick={togglePlay}>
              {playing ? <Pause size={22} /> : <Play size={22} />}
            </button>
          )}

          {!loading && (
            <div
              ref={captionRef}
              className="captions"
              style={{
                background: isDark ? "#1A1A1A" : "#f8fbff",
                border: isDark
                  ? "1px solid #2A2A2A"
                  : "1px solid #eef2f7",
                color: isDark ? "#ddd" : "#333",
              }}
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  className={i === currentWordIndex ? "activeWord" : ""}
                >
                  {word}{" "}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page { min-height: 100vh; }
        .langSwitch { display: flex; justify-content: center; gap: 10px; margin-top: 20px; }
        .langSwitch button { border: none; padding: 8px 16px; border-radius: 999px; cursor: pointer; font-weight: 600; }
        .centerWrap { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); padding: 40px 20px; }
        .card { width: 100%; max-width: 1000px; border-radius: 40px; padding: 70px 90px; display: flex; flex-direction: column; align-items: center; gap: 28px; text-align: center; }
        .mascot { width: 150px; }
        .status { font-size: 22px; font-weight: 600; }
        .playButton { width: 65px; height: 65px; border-radius: 50%; border: none; background: linear-gradient(135deg, #ff7aa8, #ff4f91); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .captions { width: 100%; height: 260px; overflow-y: auto; padding: 28px; border-radius: 20px; line-height: 1.9; font-size: 15px; }
        .activeWord { background: #ff7aa8; color: white; padding: 4px 8px; border-radius: 8px; }
      `}</style>
    </div>
  );
}