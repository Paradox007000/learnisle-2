"use client";

import TopBar from "@/components/ui/TopBar";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";

/* ---------------- CLEAN MARKDOWN ---------------- */
function cleanForSpeech(text: string) {
  return text
    .replace(/\*\*/g, "")
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

  useEffect(() => {
    const loadPodcast = async () => {
      try {
        const res = await fetch("/api/get-notes");
        if (!res.ok) throw new Error("No notes");

        const { notes } = await res.json();
        setCaptions(notes);

        const cleanText = cleanForSpeech(notes);
        const wordArray = cleanText.split(/\s+/);
        setWords(wordArray);

        const speech = new SpeechSynthesisUtterance(cleanText);

        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();
          const best =
            voices.find((v) => v.name.toLowerCase().includes("female")) ||
            voices.find((v) => v.lang.includes("en")) ||
            voices[0];

          if (best) speech.voice = best;
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
      } catch (err) {
        setStatus("No notes available");
        setLoading(false);
      }
    };

    loadPodcast();

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

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
    <div className="page">
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {/* MENU DRAWER */}
      {isMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "300px",
            height: "100vh",
            background: "white",
            zIndex: 999999,
            boxShadow: "5px 0 20px rgba(0,0,0,0.15)",
            padding: "30px 20px",
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
                style={menuStyle}
              >
                {item.icon} {item.label}
              </Link>
            ))}

            <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

            <Link
              href="/mimi"
              onClick={() => setIsMenuOpen(false)}
              style={{ ...menuStyle, gap: "12px" }}
            >
              <img
                src="/mascot.png"
                alt="Mascot"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
              Mimi
            </Link>

            <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

            <Link
              href="/account"
              onClick={() => setIsMenuOpen(false)}
              style={menuStyle}
            >
              <User size={24} strokeWidth={2.5} color="#ec4899" /> Account
            </Link>
          </div>
        </div>
      )}

      {/* OVERLAY */}
      {isMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 99999,
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="centerWrap">
        <div className="card">
          <img src="/mascot.png" className="mascot" />
          <h2 className="status">{status}</h2>

          {!loading && (
            <button className="playButton" onClick={togglePlay}>
              {playing ? <Pause size={22} /> : <Play size={22} />}
            </button>
          )}

          {playing && (
            <div className="waveWrap">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}

          {!loading && (
            <div ref={captionRef} className="captions">
              {words.map((word, i) => (
                <span key={i} className={i === currentWordIndex ? "activeWord" : ""}>
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

const menuStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "16px 18px",
  borderRadius: "14px",
  textDecoration: "none",
  color: "#111",
  fontWeight: 600,
  fontSize: "16px",
  transition: "all 0.2s ease",
};
