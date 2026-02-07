"use client";

import { useEffect, useState } from "react";

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
    <div style={{ display: "flex", height: "100vh", background: "#f5f5f5" }}>
      
      {/* 📄 LEFT SIDE — NOTES */}
      <div
        style={{
          flex: 2,
          padding: "40px",
          overflowY: "auto",
          background: "white",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>📄 Study Notes</h1>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
          {notes}
        </div>
      </div>

      {/* 🤖 RIGHT SIDE — CHATBOT */}
      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
          <h2>🤖 Ask About This Document</h2>
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
                  background: msg.role === "user" ? "#d1e7dd" : "#e2e3e5",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: "15px", borderTop: "1px solid #ddd" }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something about the document..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          />
        </div>
      </div>
    </div>
  );
}
