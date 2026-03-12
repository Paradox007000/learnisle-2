"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/ui/TopBar";
import { useRouter } from "next/navigation";
import { Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function MimiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Mimi ✨ How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* SEND MESSAGE */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mimi-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      });

      const data = await res.json();
      let reply: string = data.reply || "";

      const navMatch = reply.match(/\[NAVIGATE:(.*?)\]/);

      if (navMatch) {
        const route = navMatch[1].trim();
        reply = reply.replace(navMatch[0], "").trim();

        setTimeout(() => {
          router.push(route);
        }, 900);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops 😭 Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/bg-4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {/* MENU */}
      {isMenuOpen && (
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
              color: isDark ? "#fff" : "#111",
            }}
          >
            ×
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "40px" }}>
            {[
              { href: "/dashboard", label: "Home", icon: <Home size={24} color="#ec4899" /> },
              { href: "/arcade", label: "Arcade", icon: <Gamepad2 size={24} color="#ec4899" /> },
              { href: "/document", label: "Document", icon: <FileText size={24} color="#ec4899" /> },
              { href: "/podcast", label: "Podcast", icon: <Mic size={24} color="#ec4899" /> },
              { href: "/flashcards", label: "Flashcards", icon: <CreditCard size={24} color="#ec4899" /> },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} onClick={() => setIsMenuOpen(false)} style={menuStyle}>
                {item.icon} {item.label}
              </Link>
            ))}

            <hr style={{ margin: "12px 0", borderColor: isDark ? "#333" : "#eee" }} />

            <Link href="/mimi" onClick={() => setIsMenuOpen(false)} style={{ ...menuStyle, gap: "12px", display: "flex", alignItems: "center" }}>
              <img src="/mascot.png" alt="Mimi" style={{ width: "28px", height: "28px" }} />
              Mimi
            </Link>

            <hr style={{ margin: "12px 0", borderColor: isDark ? "#333" : "#eee" }} />

            <Link href="/account" onClick={() => setIsMenuOpen(false)} style={menuStyle}>
              <User size={24} color="#ec4899" /> Account
            </Link>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 99999,
          }}
        />
      )}

      {/* MAIN GLASS CONTAINER */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            width: "800px",
            height: "70vh",
            padding: "40px",
            borderRadius: "40px",
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(30px)",
            boxShadow: "0 40px 120px rgba(255,105,160,0.15)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* CHAT AREA */}
          <div className="chatContainer">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`messageRow ${
                  msg.role === "user" ? "userRow" : "aiRow"
                }`}
              >
                {msg.role === "assistant" && (
                  <img
                    src="/mascot.png"
                    className="avatar"
                    alt="Mimi"
                  />
                )}

                <div
                  className={`bubble ${
                    msg.role === "user" ? "userBubble" : "aiBubble"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="messageRow aiRow">
                <img src="/mascot.png" className="avatar" />
                <div className="bubble aiBubble typing">
                  Mimi is thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT BAR */}
          <div className="inputBar">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Mimi anything..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chatContainer {
          flex: 1;
          overflow-y: auto;
          padding-right: 10px;
        }

        .messageRow {
          display: flex;
          align-items: flex-end;
          margin-bottom: 18px;
          gap: 10px;
        }

        .userRow {
          justify-content: flex-end;
        }

        .aiRow {
          justify-content: flex-start;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .bubble {
          max-width: 70%;
          padding: 14px 18px;
          border-radius: 18px;
          font-size: 15px;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .userBubble {
          background: linear-gradient(135deg,#ff9ebb,#ff6fa5);
          color: white;
          border-bottom-right-radius: 6px;
        }

        .aiBubble {
          background: white;
          border: 1px solid #eee;
          color: #333;
          border-bottom-left-radius: 6px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.05);
        }

        .typing {
          opacity: 0.7;
          font-style: italic;
        }

        .inputBar {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .inputBar input {
          flex: 1;
          padding: 14px 18px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          font-size: 15px;
          outline: none;
        }

        .inputBar input:focus {
          border-color: #ff9ebb;
        }

        .inputBar button {
          border: none;
          padding: 12px 24px;
          border-radius: 999px;
          background: linear-gradient(135deg,#ff9ebb,#a0e7ff);
          color: white;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(0,0,0,0.15);
        }

        .inputBar button:hover {
          transform: translateY(-1px);
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
  fontWeight: 600,
  fontSize: "16px",
  transition: "all 0.2s ease",
};