"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/ui/TopBar";

export default function DocumentPage() {
  const [notes, setNotes] = useState("Loading notes...");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ LOAD SAVED NOTES (DO NOT GENERATE AGAIN)
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

  // 🤖 Ask AI about document
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
      {/* 🌸 TOP BAR */}
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {/* 📂 MENU DRAWER */}
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
            boxShadow: "5px 0 20px rgba(0,0,0,0.3)",
            padding: "40px 20px",
          }}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              fontSize: "30px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <div style={{ marginTop: "20px" }}>
            <Link href="/arcade" onClick={() => setIsMenuOpen(false)} style={menuStyle}>🎮 Arcade</Link>
            <Link href="/document" onClick={() => setIsMenuOpen(false)} style={menuStyle}>📄 Document</Link>
            <Link href="/podcast" onClick={() => setIsMenuOpen(false)} style={menuStyle}>🎙️ Podcast</Link>
            <Link href="/flashcards" onClick={() => setIsMenuOpen(false)} style={menuStyle}>🃏 Flashcards</Link>
            <hr style={dividerStyle} />
            <Link href="/mimi" onClick={() => setIsMenuOpen(false)} style={{ ...menuStyle, background: "#fce4ec" }}>😺 Mimi</Link>
            <hr style={dividerStyle} />
            <Link href="/account" onClick={() => setIsMenuOpen(false)} style={{ ...menuStyle, background: "#f5f5f5" }}>👤 Account</Link>
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
      <div style={{ display: "flex", flex: 1, background: "#FFFDF7" }}>
        
        {/* 📄 NOTES */}
        <div
          style={{
            flex: 2,
            padding: "40px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h1 style={{ marginBottom: "20px", color: "#3A4F41" }}>
              📄 Study Notes
            </h1>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.7",
                color: "#444",
              }}
            >
              {notes}
            </div>
          </div>
        </div>

        {/* 🤖 MIMI CHAT */}
        <div
          style={{
            flex: 1,
            borderLeft: "1px solid #F0EAE2",
            display: "flex",
            flexDirection: "column",
            background: "#FFF9F2",
          }}
        >
          <div style={{ padding: "20px", borderBottom: "1px solid #F0EAE2" }}>
            <h2 style={{ color: "#5C4033" }}>Chat with Mimi</h2>
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
                      msg.role === "user" ? "#DDF4E4" : "#FFFFFF",
                    border:
                      msg.role === "ai"
                        ? "1px solid #F1F1F1"
                        : "none",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "15px", borderTop: "1px solid #F0EAE2" }}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Mimi about your document..."
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #EADFD6",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const menuStyle = {
  display: "block",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "10px",
  background: "#e3f2fd",
  textDecoration: "none",
  color: "black",
  fontWeight: "bold",
};

const dividerStyle = {
  margin: "20px 0",
  border: "none",
  height: "1px",
  background: "#ddd",
};
