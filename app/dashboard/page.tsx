"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [files, setFiles] = useState([
    { id: 1, name: "UML, Data Modeling, and V-Model Testing", type: "pdf", lastOpened: "1 day ago" },
    { id: 2, name: "Java Basic Syntax and Constructs", type: "pdf", lastOpened: "3 days ago" },
    { id: 3, name: "Java Programming Concepts and Examples", type: "docx", lastOpened: "7 days ago" },
  ]);
  const [dragOver, setDragOver] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => setMounted(true), []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    let file: File | null = null;

    if ("dataTransfer" in e) {
      file = e.dataTransfer.files[0];
    } else {
      file = e.target.files?.[0] || null;
    }

    if (!file) return;

    setDragOver(false);

    const newFile = {
      id: Date.now(),
      name: file.name,
      type: file.name.split(".").pop()?.toLowerCase() || "unknown",
      lastOpened: "Just now",
    };

    setFiles((prev) => [newFile, ...prev]);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.documentId) {
        localStorage.setItem("latestDoc", data.documentId);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return "📄";
      case "doc":
      case "docx": return "📝";
      default: return "📎";
    }
  };

  // Menu styles
  const menuStyle: React.CSSProperties = {
    display: "block",
    padding: "12px 20px",
    borderRadius: "12px",
    marginBottom: "10px",
    textDecoration: "none",
    color: "#111",
    fontWeight: 500,
  };

  const dividerStyle: React.CSSProperties = {
    margin: "15px 0",
    borderColor: "#ddd",
  };

  return (
    <>
      <div className="min-h-screen pt-24 bg-[#FFFDF7] dark:bg-[#1E1E1E] px-8 transition-colors duration-300">

        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-[#1E1E1E] shadow-md flex items-center px-6 z-50 transition-colors duration-300">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMenuOpen(true)} className="text-2xl dark:text-white">☰</button>
              {/* Logo enlarged */}
              <img src="/logo.png" alt="Logo" className="h-24 w-auto object-contain" />
            </div>

            <div className="flex items-center gap-4">
              <Link href="/account">
                <Image src="/profile.png" alt="Profile" width={40} height={40} />
              </Link>

              {mounted && (
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="text-xl dark:text-white"
                >
                  {theme === "dark" ? "☀️" : "🌙"}
                </button>
              )}
            </div>
          </div>
        </header>

    
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
              <Link
                href="/arcade"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...menuStyle, background: "#e6f0ff" }}
              >
                🎮 Arcade
              </Link>
              <Link
                href="/document"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...menuStyle, background: "#e6f0ff" }}
              >
                📄 Document
              </Link>
              <Link
                href="/podcast"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...menuStyle, background: "#e6f0ff" }}
              >
                🎙️ Podcast
              </Link>
              <Link
                href="/flashcards"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...menuStyle, background: "#e6f0ff" }}
              >
                🃏 Flashcards
              </Link>
              <hr style={dividerStyle} />
              <Link
                href="/mimi"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...menuStyle, background: "#fce4ec" }}
              >
                😺 Mimi
              </Link>
              <hr style={dividerStyle} />
              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...menuStyle, background: "#f5f5f5" }}
              >
                👤 Account
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

        {/* TITLE */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Create and manage your AI study tools
          </p>
        </div>

        {/* FEATURE BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/document">
            <div className="premiumCard">
              <div className="cardIcon bg-purple-100 text-purple-600">📄</div>
              <div>
                <h3>Summarize Document</h3>
                <p>Upload PDF & get smart notes</p>
              </div>
            </div>
          </Link>

          <Link href="/flashcards">
            <div className="premiumCard">
              <div className="cardIcon bg-pink-100 text-pink-600">🃏</div>
              <div>
                <h3>Generate Flashcards</h3>
                <p>Auto-create exam revision cards</p>
              </div>
            </div>
          </Link>

          <Link href="/podcast">
            <div className="premiumCard">
              <div className="cardIcon bg-blue-100 text-blue-600">🎙️</div>
              <div>
                <h3>AI Podcast</h3>
                <p>Turn notes into audio explanation</p>
              </div>
            </div>
          </Link>
        </div>

        {/* UPLOAD */}
        <div className="flex justify-center mb-12">
          <div
            className={`uploadBox ${dragOver ? "dragActive" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileUpload}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              accept=".pdf,.doc,.docx"
            />
            <div className="text-4xl mb-3">📄</div>
            <p className="text-lg font-semibold">
              Drop your PDF here or click to upload
            </p>
          </div>
        </div>

        {/* FILE LIST */}
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          My Files
        </h2>

        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id} className="fileRow">
              <div className="flex items-center gap-4">
                <div className="docIcon">{getFileIcon(file.type)}</div>
                <div>
                  <h4 className="font-medium dark:text-white">{file.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {file.lastOpened}
                  </p>
                </div>
              </div>
              <span className="text-xl text-gray-400 cursor-pointer">⋮</span>
            </div>
          ))}
        </div>

        {/* STYLES */}
        <style jsx>{`
          .premiumCard { display: flex; align-items: center; gap: 18px; padding: 24px; border-radius: 20px; background: white; box-shadow: 0 6px 20px rgba(0,0,0,0.06); transition: all 0.3s ease; cursor: pointer; }
          .premiumCard:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
          :global(.dark) .premiumCard { background: #2a2a2a; box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
          :global(.dark) .premiumCard h3 { color: #ffffff; }
          :global(.dark) .premiumCard p { color: #cbd5e1; }
          .cardIcon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
          .uploadBox { width: 65%; max-width: 750px; border: 2px dashed #ccc; border-radius: 20px; padding: 50px; text-align: center; background: white; transition: all 0.3s ease; cursor: pointer; }
          :global(.dark) .uploadBox { background: #2a2a2a; border-color: #444; color: #ffffff; }
          .dragActive { border-color: #6366f1; background: #f3f4ff; }
          :global(.dark) .dragActive { background: #2f2f3f; }
          .fileRow { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-radius: 18px; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s ease; }
          .fileRow:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
          :global(.dark) .fileRow { background: #2a2a2a; box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
          .docIcon { width: 42px; height: 42px; border-radius: 12px; background: #4f46e5; color: white; display: flex; align-items: center; justify-content: center; }
        `}</style>

      </div>
    </>
  );
}
