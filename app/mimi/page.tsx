
"use client";

import { useEffect, useRef, useState } from "react";
import TopBar from "@/components/ui/TopBar";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function MimiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Mimi ✨ How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  /* ----------------------------- */
  /* AUTO SCROLL                   */
  /* ----------------------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ----------------------------- */
  /* SEND MESSAGE                  */
  /* ----------------------------- */

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

      /* ----------------------------- */
      /* NAVIGATION PARSER             */
      /* ----------------------------- */

      const navMatch = reply.match(
        /\[NAVIGATE:(.*?)\]/
      );

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
          content:
            "Oops 😭 Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  /* ----------------------------- */
  /* ENTER KEY                     */
  /* ----------------------------- */

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") sendMessage();
  };

  /* ----------------------------- */
  /* UI                            */
  /* ----------------------------- */

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

      {/* CHAT AREA */}
      <div className="chatContainer">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`messageRow ${
              msg.role === "user"
                ? "userRow"
                : "aiRow"
            }`}
          >
            {/* MIMI AVATAR */}
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
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask Mimi anything..."
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>

      {/* ---------- STYLES ---------- */}
      <style jsx>{`
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

        /* USER */
        .userBubble {
          background: linear-gradient(
            135deg,
            #ff9ebb,
            #ff6fa5
          );
          color: white;
          border-bottom-right-radius: 6px;
        }

        /* AI */
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

        /* INPUT BAR */
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
