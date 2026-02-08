"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/ui/TopBar";

export default function DocumentPage() {
  const [notes, setNotes] = useState("Loading notes...");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);

  // 📄 Load AI Notes
  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch("/api/generate-notes", { method: "POST" });
      const data = await res.json();
      setNotes(data.notes || "No notes generated.");
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
    
    {/* 🌸 TOP MENU BAR */}
    <TopBar />

    {/* MAIN CONTENT */}
    <div style={{ display: "flex", flex: 1, background: "#FFFDF7" }}>
      
      {/* 📄 LEFT SIDE — NOTES */}
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
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", color: "#444" }}>
            {notes}
          </div>
        </div>
      </div>

      {/* 🤖 RIGHT SIDE — MIMI CHAT */}
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
                marginBottom: "12px",
                textAlign: msg.role === "user" ? "right" : "left",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background:
                    msg.role === "user" ? "#D8F3DC" : "#FDE2E4",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: "15px", borderTop: "1px solid #F0EAE2" }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Mimi about your document..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #EADFD6",
            }}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          />
        </div>
      </div>
    </div>
  </div>
);

  
}
