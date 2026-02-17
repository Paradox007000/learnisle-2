"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";


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
        window.dispatchEvent(new Event("flashcardsUpdated"));
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

  const menuStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "16px 18px",
  borderRadius: "14px",
  textDecoration: "none",
  color: "#111",
  fontWeight: 600,
  fontSize: "16px",
  transition: "all 0.2s ease",
};



  const dividerStyle: React.CSSProperties = {
    margin: "15px 0",
    borderColor: "#ddd",
  };

  return (
    <>
    <div
  className="min-h-screen pt-24 px-8 transition-colors duration-300"
  style={{
    background: theme === "dark"
      ? "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 50%, #3a3a3a 100%)" // subtle dark gray gradient
      : "linear-gradient(135deg, #ffe6f0 0%, #e0f0ff 100%)",             // faded pink → faded blue
  }}
>

{/* HEADER */}
        <header className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-[#1E1E1E] shadow-md flex items-center px-6 z-50 transition-colors duration-300">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMenuOpen(true)} className="text-2xl dark:text-white">☰</button>
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


{/* MENU DRAWER */}
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
      boxShadow: "5px 0 20px rgba(0,0,0,0.15)",
      padding: "30px 20px",
    }}
  >
    {/* CLOSE BUTTON */}
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
        { href: "/", label: "Home", icon: <Home size={24} strokeWidth={2.5} color="#ec4899" /> },
        { href: "/arcade", label: "Arcade", icon: <Gamepad2 size={24} strokeWidth={2.5} color="#ec4899" /> },
        { href: "/document", label: "Document", icon: <FileText size={24} strokeWidth={2.5} color="#ec4899" /> },
        { href: "/podcast", label: "Podcast", icon: <Mic size={24} strokeWidth={2.5} color="#ec4899" /> },
        { href: "/flashcards", label: "Flashcards", icon: <CreditCard size={24} strokeWidth={2.5} color="#ec4899" /> },
      ].map((item, index) => (
        <Link
          key={index}
          href={item.href}
          onClick={() => setIsMenuOpen(false)}
          style={menuStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(128,128,128,0.08)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {item.icon} {item.label}
        </Link>
      ))}

      <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

     <Link
  href="/mimi"
  onClick={() => setIsMenuOpen(false)}
  style={{ ...menuStyle, gap: "12px", display: "flex", alignItems: "center" }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(128,128,128,0.08)";
    e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.boxShadow = "none";
  }}
>
  <img
    src="/mascot.png"
    alt="Mascot"
    style={{ width: "28px", height: "28px", objectFit: "contain" }}
  />
  Mimi
</Link>


      <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

      <Link
        href="/account"
        onClick={() => setIsMenuOpen(false)}
        style={menuStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(128,128,128,0.08)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <User size={24} strokeWidth={2.5} color="#ec4899" /> Account
      </Link>
    </div>
  </div>
)}

{/* OVERLAY */}
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


        {/* TITLE */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Create and manage your AI study tools
          </p>
        </div>

        {/* FEATURE BOXES (Updated Order) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
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
                <p>Turn notes into audio </p>
              </div>
            </div>
          </Link>

          <Link href="/arcade">
            <div className="premiumCard">
              <div className="cardIcon bg-indigo-100 text-indigo-600">🎮</div>
              <div>
                <h3>Arcade</h3>
                <p>Play fun mini-games</p>
              </div>
            </div>
          </Link>
        </div>

        {/* UPLOAD BOX & FILE LIST (unchanged) */}
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

        <h2 className="text-lg font-semibold mb-4 dark:text-white">My Files</h2>
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id} className="fileRow">
              <div className="flex items-center gap-4">
                <div className="docIcon">{getFileIcon(file.type)}</div>
                <div>
                  <h4 className="font-medium dark:text-white">{file.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{file.lastOpened}</p>
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