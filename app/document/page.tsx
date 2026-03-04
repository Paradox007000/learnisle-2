"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/ui/TopBar";
import { Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";

export default function DocumentPage() {
  const [notes, setNotes] = useState("Loading notes...");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/get-notes");

        if (!res.ok) {
          setNotes("Generate notes first 📄");
          return;
        }

        const data = await res.json();
        setNotes(data.notes || "No notes generated.");
      } catch (err) {
        console.error("Notes load error:", err);
        setNotes("Failed to load notes.");
      }
    };

    fetchNotes();
  }, []);

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user" as const, text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    const res = await fetch("/api/chat-with-doc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    const aiMessage = { role: "ai" as const, text: data.answer };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
                  ...menuStyle,
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
              href="/mimi"
              onClick={() => setIsMenuOpen(false)}
              style={{
                ...menuStyle,
                gap: "12px",
                display: "flex",
                alignItems: "center",
                color: isDark ? "white" : "#111",
              }}
            >
              <img
                src="/mascot.png"
                alt="Mascot"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
              Mimi
            </Link>

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
                ...menuStyle,
                color: isDark ? "white" : "#111",
              }}
            >
              <User size={24} strokeWidth={2.5} color="#ec4899" /> Account
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
            background: "rgba(0,0,0,0.5)",
            zIndex: 99999,
          }}
        />
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          display: "flex",
          flex: 1,
          background: isDark ? "#1E1E1E" : "#FFFDF7",
        }}
      >
        <div style={{ flex: 2, padding: "40px", overflowY: "auto" }}>
          <div
            style={{
              background: isDark ? "#2A2A2A" : "#FFFFFF",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              color: isDark ? "white" : "#444",
            }}
          >
            <h1
              style={{
                marginBottom: "20px",
                color: isDark ? "white" : "#3A4F41",
              }}
            >
              📄 Study Notes
            </h1>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.7",
                color: isDark ? "#ddd" : "#444",
              }}
            >
              {notes}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            borderLeft: isDark
              ? "1px solid #2A2A2A"
              : "1px solid #F0EAE2",
            display: "flex",
            flexDirection: "column",
            background: isDark ? "#1A1A1A" : "#FFF9F2",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: isDark
                ? "1px solid #2A2A2A"
                : "1px solid #F0EAE2",
            }}
          >
            <h2 style={{ color: isDark ? "white" : "#5C4033" }}>
              Chat with Mimi
            </h2>
          </div>

          <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  gap: "10px",
                }}
              >
                {msg.role === "ai" && (
                  <img
                    src="/mascot.png"
                    alt="Mimi"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                    }}
                  />
                )}

                <div
                  style={{
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: "18px",
                    background:
                      msg.role === "user"
                        ? "#DDF4E4"
                        : isDark
                        ? "#2A2A2A"
                        : "#FFFFFF",
                    border:
                      msg.role === "ai"
                        ? isDark
                          ? "1px solid #2A2A2A"
                          : "1px solid #F1F1F1"
                        : "none",
                    color: isDark ? "white" : "#111",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "15px",
              borderTop: isDark
                ? "1px solid #2A2A2A"
                : "1px solid #F0EAE2",
            }}
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Mimi about your document..."
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: isDark
                  ? "1px solid #2A2A2A"
                  : "1px solid #EADFD6",
                background: isDark ? "#2A2A2A" : "white",
                color: isDark ? "white" : "#111",
              }}
            />
          </div>
        </div>
      </div>
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