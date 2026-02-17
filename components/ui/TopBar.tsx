"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TopBar from "@/components/ui/TopBar";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg,#fdfbff 0%,#f4f9ff 100%)",
      }}
    >
      <TopBar />

      {/* MENU BUTTON */}
      <button
        className="menuButton"
        onClick={() => setMenuOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* DRAWER MENU */}
      <div className={`sideMenu ${menuOpen ? "open" : ""}`}>
        <div className="menuHeader">
          <h3>Menu</h3>
          <X
            size={22}
            onClick={() => setMenuOpen(false)}
            style={{ cursor: "pointer" }}
          />
        </div>

        <button onClick={() => router.push("/")}>
          Home
        </button>

        <button onClick={() => router.push("/flashcards")}>
          Flashcards
        </button>

        <button onClick={() => router.push("/podcast")}>
          Podcast
        </button>

        <button onClick={() => router.push("/mimi")}>
          Mimi
        </button>
      </div>

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
                msg.role === "user"
                  ? "userBubble"
                  : "aiBubble"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="messageRow aiRow">
            <img
              src="/mascot.png"
              className="avatar"
            />
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

      <style jsx>{`
        .menuButton {
          position: fixed;
          top: 18px;
          left: 18px;
          background: white;
          border: none;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          cursor: pointer;
          z-index: 1001;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 1000;
        }

        .sideMenu {
          position: fixed;
          top: 0;
          left: -260px;
          width: 260px;
          height: 100%;
          background: white;
          padding: 24px;
          box-shadow: 4px 0 20px rgba(0,0,0,0.1);
          transition: 0.3s ease;
          z-index: 1002;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sideMenu.open {
          left: 0;
        }

        .menuHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .sideMenu button {
          border: none;
          background: #f4f6ff;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
        }

        .chatContainer {
          flex: 1;
          overflow-y: auto;
          padding: 40px 20px;
          max-width: 900px;
          width: 100%;
          margin: auto;
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
          background: linear-gradient(
            135deg,
            #ff9ebb,
            #ff6fa5
          );
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
          padding: 18px;
          background: white;
          border-top: 1px solid #eee;
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
          background: linear-gradient(
            135deg,
            #ff9ebb,
            #a0e7ff
          );
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
