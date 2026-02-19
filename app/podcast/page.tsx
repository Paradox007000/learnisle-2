"use client";

import TopBar from "@/components/ui/TopBar";
import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

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
      <TopBar openMenu={() => {}} />

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
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
        }

        .status {
          font-size: 22px;
          font-weight: 600;
          color: #333;
        }

        /* ✅ Smaller Play Button */
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
          box-shadow: 0 15px 30px rgba(255, 79, 145, 0.3);
          transition: 0.3s ease;
        }

        .playButton:hover {
          transform: scale(1.08);
        }

        .waveWrap {
          display: flex;
          gap: 6px;
          height: 30px;
        }

        .waveWrap span {
          width: 6px;
          height: 100%;
          background: linear-gradient(to top, #ff9ebb, #ffc2d6);
          border-radius: 6px;
          animation: bounce 1.2s infinite ease-in-out;
          transform-origin: bottom;
        }

        @keyframes bounce {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
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
