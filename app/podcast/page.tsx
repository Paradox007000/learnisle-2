"use client";

import TopBar from "@/components/ui/TopBar";
import { useEffect, useRef, useState } from "react";

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

  // ⭐ NEW — word highlighting
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  /* ------------------------------------------------ */
  /* 🎙️ PODCAST + SPEECH                             */
  /* ------------------------------------------------ */

  useEffect(() => {
    // prevent restarting if already speaking
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

        // split words for highlighting
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

        /* ✅ START EVENT */
        speech.onstart = () => {
          setLoading(false);
          setPlaying(true);
          setStatus("Now playing 🎧");
          setProgress(100);
        };

        /* ✅ LIVE WORD TRACKING */
        speech.onboundary = (event) => {
          if (event.name === "word") {
            const spokenText = cleanText.substring(0, event.charIndex);
            const index = spokenText.split(/\s+/).length - 1;
            setCurrentWordIndex(index);
          }
        };

        /* ✅ END EVENT */
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

    // stop audio when leaving page
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
      <TopBar />

      <div className="container">
        <div className="card">

          {/* Mascot */}
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
              <div
                className="progressFill"
                style={{ width: `${progress}%` }}
              />
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

      {/* ---------------- STYLES ---------------- */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(180deg,#fdfbff,#f3f9ff);
        }

        .container {
          display:flex;
          justify-content:center;
          align-items:center;
          padding:40px 20px;
        }

        .card {
          width:100%;
          max-width:820px;
          background:white;
          border-radius:28px;
          padding:40px;
          box-shadow:0 20px 60px rgba(0,0,0,0.08);
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:24px;
        }

        .mascotWrap{
          position:relative;
          width:140px;
        }

        .mascot{
          width:100%;
          filter:drop-shadow(0 12px 25px rgba(0,0,0,0.15));
        }

        .status{
          color:#333;
          font-weight:600;
        }

        .progressBar{
          width:320px;
          height:10px;
          background:#eee;
          border-radius:999px;
          overflow:hidden;
        }

        .progressFill{
          height:100%;
          background:linear-gradient(90deg,#ff9ebb,#a0e7ff);
          transition:width .6s ease;
        }

        .playBtn{
          border:none;
          padding:14px 32px;
          border-radius:999px;
          background:linear-gradient(135deg,#ff9ebb,#ffa7c4);
          color:white;
          font-size:16px;
          cursor:pointer;
          box-shadow:0 10px 25px rgba(0,0,0,.15);
        }

        .captions{
          width:100%;
          max-width:640px;
          height:260px;
          overflow-y:auto;
          background:#fafcff;
          border-radius:18px;
          padding:20px;
          line-height:1.9;
          color:#444;
          border:1px solid #eef2f7;
        }

        /* ⭐ PINK WORD HIGHLIGHT */
        .activeWord{
          background:#ff9ebb;
          color:white;
          padding:3px 7px;
          border-radius:8px;
          transition:all .2s ease;
        }

        /* SOUND WAVES */
        .waves{
          position:absolute;
          bottom:-15px;
          left:50%;
          transform:translateX(-50%);
          display:flex;
          gap:6px;
          height:30px;
        }

        .waves span{
          width:6px;
          height:100%;
          background:linear-gradient(to top,#ff9ebb,#ffc2d6);
          border-radius:6px;
          animation:bounce 1.2s infinite ease-in-out;
          transform-origin:bottom;
        }

        @keyframes bounce{
          0%,100%{transform:scaleY(.3);}
          50%{transform:scaleY(1);}
        }
      `}</style>
    </div>
  );
}
