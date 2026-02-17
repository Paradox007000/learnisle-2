"use client";

import TopBar from "@/components/ui/TopBar";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";

/* ------------------------------------------------ */
/* 🧹 CLEAN MARKDOWN FOR SPEECH                     */
/* ------------------------------------------------ */
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
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing podcast...");
  const [captions, setCaptions] = useState("");
  const [playing, setPlaying] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // ✅ MENU STATE
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* ------------------------------------------------ */
  /* 🎙️ PODCAST + SPEECH                             */
  /* ------------------------------------------------ */

  useEffect(() => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      setLoading(false);
      setPlaying(true);
      setStatus("Now playing 🎧");
      return;
    }

    const startPodcast = async () => {
      try {
        setStatus("Fetching your notes...");
        setProgress(30);

        const res = await fetch("/api/get-notes");
        if (!res.ok) throw new Error("No notes");

        const { notes } = await res.json();

        setCaptions(notes);

        const cleanText = cleanForSpeech(notes);
        const wordArray = cleanText.split(/\s+/);
        setWords(wordArray);

        setStatus("Preparing Mimi's voice...");
        setProgress(70);

        const speech = new SpeechSynthesisUtterance(cleanText);

        const voices = speechSynthesis.getVoices();
        const bestVoice =
          voices.find(v => v.name.toLowerCase().includes("female")) ||
          voices.find(v => v.lang.includes("en")) ||
          voices[0];

        if (bestVoice) speech.voice = bestVoice;

        speech.rate = 0.95;
        speech.pitch = 1.15;

        speech.onstart = () => {
          setLoading(false);
          setPlaying(true);
          setStatus("Now playing 🎧");
          setProgress(100);
        };

        speech.onboundary = (event) => {
          if (event.name === "word") {
            const spokenText = cleanText.substring(0, event.charIndex);
            const index = spokenText.split(/\s+/).length - 1;
            setCurrentWordIndex(index);
          }
        };

        speech.onend = () => {
          setPlaying(false);
          setStatus("Podcast finished ✨");
        };

        utteranceRef.current = speech;

        setTimeout(() => {
          speechSynthesis.speak(speech);
        }, 400);

      } catch (err) {
        console.error(err);
        setStatus("No notes available 😭");
        setLoading(false);
      }
    };

    startPodcast();

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  /* ------------------------------------------------ */
  /* ▶️ PLAY / PAUSE                                 */
  /* ------------------------------------------------ */

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

  /* ------------------------------------------------ */
  /* 📜 AUTO SCROLL                                  */
  /* ------------------------------------------------ */

  useEffect(() => {
    if (!captionRef.current) return;

    const el = captionRef.current;
    const active = el.querySelector(".activeWord");

    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentWordIndex]);

  /* ------------------------------------------------ */
  /* 🎨 UI                                           */
  /* ------------------------------------------------ */

  return (
    <div className="page">

      {/* ✅ TOPBAR WITH MENU BUTTON */}
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {/* ✅ SIDEBAR MENU */}
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
              { href: "/", label: "Home", icon: <Home size={24} strokeWidth={2.5} color="#ec4899" /> },
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(128,128,128,0.08)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {item.icon} {item.label}
              </Link>
            ))}

            <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

            <Link
              href="/mimi"
              onClick={() => setIsMenuOpen(false)}
              style={{ ...menuStyle, display: "flex", alignItems: "center" }}
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

      {/* ✅ OVERLAY */}
      {isMenuOpen && (
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
      )}

      {/* 🔥 YOUR ORIGINAL CONTENT BELOW (UNCHANGED) */}
      <div className="container">
        <div className="card">

          <div className="mascotWrap">
            <img src="/mascot.png" className="mascot" />
            {playing && (
              <div className="waves">
                {[0,1,2,3,4].map(i => (
                  <span key={i} style={{animationDelay:`${i*0.15}s`}}/>
                ))}
              </div>
            )}
          </div>

          <h2 className="status">{status}</h2>

          {loading && (
            <div className="progressBar">
              <div className="progressFill" style={{ width: `${progress}%` }} />
            </div>
          )}

          {!loading && (
            <button className="playBtn" onClick={togglePlay}>
              {playing ? "Pause ⏸️" : "Play ▶️"}
            </button>
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

      {/* KEEPING YOUR ORIGINAL STYLES UNTOUCHED */}
      <style jsx>{`
        .page { min-height:100vh; background:linear-gradient(180deg,#fdfbff,#f3f9ff); }
        .container { display:flex; justify-content:center; align-items:center; padding:40px 20px; }
        .card { width:100%; max-width:820px; background:white; border-radius:28px; padding:40px; box-shadow:0 20px 60px rgba(0,0,0,0.08); display:flex; flex-direction:column; align-items:center; gap:24px; }
        .mascotWrap{ position:relative; width:140px; }
        .mascot{ width:100%; filter:drop-shadow(0 12px 25px rgba(0,0,0,0.15)); }
        .status{ color:#333; font-weight:600; }
        .progressBar{ width:320px; height:10px; background:#eee; border-radius:999px; overflow:hidden; }
        .progressFill{ height:100%; background:linear-gradient(90deg,#ff9ebb,#a0e7ff); transition:width .6s ease; }
        .playBtn{ border:none; padding:14px 32px; border-radius:999px; background:linear-gradient(135deg,#ff9ebb,#ffa7c4); color:white; font-size:16px; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,.15); }
        .captions{ width:100%; max-width:640px; height:260px; overflow-y:auto; background:#fafcff; border-radius:18px; padding:20px; line-height:1.9; color:#444; border:1px solid #eef2f7; }
        .activeWord{ background:#ff9ebb; color:white; padding:3px 7px; border-radius:8px; transition:all .2s ease; }
        .waves{ position:absolute; bottom:-15px; left:50%; transform:translateX(-50%); display:flex; gap:6px; height:30px; }
        .waves span{ width:6px; height:100%; background:linear-gradient(to top,#ff9ebb,#ffc2d6); border-radius:6px; animation:bounce 1.2s infinite ease-in-out; transform-origin:bottom; }
        @keyframes bounce{ 0%,100%{transform:scaleY(.3);} 50%{transform:scaleY(1);} }
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
