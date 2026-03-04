"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import TopBar from "@/components/ui/TopBar";
import { soundManager } from "@/utils/soundManager";
import {
  Home,
  Gamepad2,
  FileText,
  Mic,
  CreditCard,
  User,
} from "lucide-react";

export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [muted, setMuted] = useState(soundManager.getMuted());
  const pathname = usePathname();

  /* ===============================
     BACKGROUND MUSIC (FIXED)
     Keeps user interaction unlock
  =============================== */
  useEffect(() => {
    if (pathname !== "/arcade") {
      soundManager.stopBackground();
      return;
    }

    const startMusic = () => {
      soundManager.playBackground();
      document.removeEventListener("click", startMusic);
    };

    document.addEventListener("click", startMusic);

    return () => {
      document.removeEventListener("click", startMusic);
      soundManager.stopBackground();
    };
  }, [pathname]);

  /* ===============================
     MUTE TOGGLE
  =============================== */
  const toggleMute = () => {
    soundManager.toggleMute();
    setMuted(soundManager.getMuted());
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
        background: "transparent", // IMPORTANT for full bg in page.tsx
      }}
    >
      {/* TOP BAR */}
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {/* FLOATING MUSIC BUTTON */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999999,
        }}
      >
        <Image
          src={muted ? "/images/mute.png" : "/images/volume.png"}
          alt="volume toggle"
          width={44}
          height={44}
          onClick={toggleMute}
          style={{
            cursor: "pointer",
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
          }}
        />
      </div>

      {/* SIDE MENU */}
      {isMenuOpen && (
        <>
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
                { href: "/dashboard", label: "Home", icon: <Home size={24} color="#ec4899" /> },
                { href: "/arcade", label: "Arcade", icon: <Gamepad2 size={24} color="#ec4899" /> },
                { href: "/document", label: "Document", icon: <FileText size={24} color="#ec4899" /> },
                { href: "/podcast", label: "Podcast", icon: <Mic size={24} color="#ec4899" /> },
                { href: "/flashcards", label: "Flashcards", icon: <CreditCard size={24} color="#ec4899" /> },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={menuStyle}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

              <Link
                href="/mimi"
                onClick={() => setIsMenuOpen(false)}
                style={menuStyle}
              >
                <img
                  src="/mascot.png"
                  alt="Mascot"
                  style={{ width: "28px", height: "28px" }}
                />
                Mimi
              </Link>

              <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                style={menuStyle}
              >
                <User size={24} color="#ec4899" />
                Account
              </Link>
            </div>
          </div>

          {/* OVERLAY */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              zIndex: 99999,
            }}
            onClick={() => setIsMenuOpen(false)}
          />
        </>
      )}

      {/* CONTENT AREA (NO padding — page.tsx controls layout) */}
      <main
        style={{
          flex: 1,
          width: "100%",
          position: "relative",
        }}
      >
        {children}
      </main>
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
  color: "#111",
  fontWeight: 600,
  fontSize: "16px",
};