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
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

    // Show file in UI immediately
    const newFile = {
      id: Date.now(),
      name: file.name,
      type: file.name.split(".").pop()?.toLowerCase() || "unknown",
      lastOpened: "Just now",
    };
    setFiles((prev) => [newFile, ...prev]);

    // Send file to backend
    const formData = new FormData();
    formData.append("pdf", file); // must be called "pdf"

    try {
      const res = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });
      const data: { success?: boolean; documentId?: string; error?: string } = await res.json();
      console.log("✅ Server response:", data);
      if (data.success && data.documentId) {
  console.log("📄 PDF processed and saved.");
  
  // ✅ Save latest documentId
  localStorage.setItem("latestDoc", data.documentId);
}

    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': case 'doc': return '📝';
      case 'mp3': case 'wav': return '🎵';
      default: return '📎';
    }
  };

  return (
    <>
      {/* MENU */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '300px',
          height: '100vh',
          background: 'white',
          zIndex: 999999,
          boxShadow: '5px 0 20px rgba(0,0,0,0.3)',
          padding: '40px 20px',
          transform: 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}>
          <button onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '30px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >×</button>

          <div style={{ marginTop: '20px' }}>
            <Link href="/arcade" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '15px', marginBottom: '10px', borderRadius: '10px', background: '#e3f2fd', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>🎮 Arcade</Link>
            <Link href="/document" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '15px', marginBottom: '10px', borderRadius: '10px', background: '#e3f2fd', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>📄 Document</Link>
            <Link href="/podcast" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '15px', marginBottom: '10px', borderRadius: '10px', background: '#e3f2fd', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>🎙️ Podcast</Link>
            <Link href="/flashcards" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '15px', marginBottom: '10px', borderRadius: '10px', background: '#e3f2fd', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>🃏 Flashcards</Link>
            <hr style={{ margin: '20px 0', border: 'none', height: '1px', background: '#ddd' }} />
            <Link href="/mimi" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '15px', marginBottom: '10px', borderRadius: '10px', background: '#fce4ec', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>😺 Mimi</Link>
            <hr style={{ margin: '20px 0', border: 'none', height: '1px', background: '#ddd' }} />
            <Link href="/account" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '15px', marginBottom: '10px', borderRadius: '10px', background: '#f5f5f5', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>👤 Account</Link>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
     <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#FFFDF7' }}>

        {/* HEADER */}
        <header style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '80px',
          background: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          zIndex: 1000
        }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: isDark ? '#38385bff' : '#f0f0f0',
              color: isDark ? 'white' : '#333',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          > ☰</button>

          <div className="w-full flex items-center py-4 pl-10">
  <img
    src="/logo.png"
    alt="Learnisle Logo"
    className="h-28 object-contain"
  />
</div>
          {/* RIGHT SIDE: Account shortcut + Theme toggle */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/account">
  <div
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      overflow: "hidden",
      cursor: "pointer"
    }}
  >
    <Image
      src="/profile.png"
      alt="Profile"
      width={40}
      height={40}
      style={{ objectFit: "cover" }}
    />
  </div>
</Link>
{mounted && (
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '50%',
                  background: isDark ? '#080808ff' : '#f0f0f0',
                  border: '1px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            )}
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div style={{ padding: '120px 20px 40px', maxWidth: '800px', margin: '0 auto' }}>
          {/* LARGER DRAG & DROP UPLOAD ZONE */}
          <div
            style={{
              border: dragOver ? '3px dashed #2196f3' : '2px dashed #a5a3a3ff',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              background: dragOver ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255,255,255,0.8)',
              transition: 'all 0.3s ease',
              marginBottom: '40px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleFileUpload}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx"
            />
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
              Drop PDF here or click to upload
            </div>
            <div style={{ fontSize: '16px', color: '#666' }}>
              Your files will appear in My Files below
            </div>
          </div>

          {/* MY FILES SECTION */}
          <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #a5a3a3ff' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1976d2', marginBottom: '10px' }}>
              My Files
            </h2>
          </div>

          {/* FILES LIST */}
          <div>
            {files.map((file) => (
              <div key={file.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '16px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#2196f3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(33,150,243,0.3)'
                  }}>
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {file.lastOpened}
                    </div>
                  </div>
                </div>
                <button style={{
                  opacity: 0.5,
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '8px'
                }}>
                  ⋮⋮
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
