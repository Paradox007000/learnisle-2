"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
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
  const [mounted, setMounted] = useState(false);

  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  /* ===============================
     BACKGROUND MUSIC
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

  const toggleMute = () => {
    soundManager.toggleMute();
    setMuted(soundManager.getMuted());
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
        background: "transparent", // IMPORTANT
      }}
    >
      <TopBar openMenu={() => setIsMenuOpen(true)} />

      {/* Floating Music Button */}
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

      {/* Side Menu */}
      {isMenuOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "300px",
              height: "100vh",
              background: isDark ? "#1E1E1E" : "white",
              color: isDark ? "#fff" : "#111",
              zIndex: 999999,
              boxShadow: "5px 0 20px rgba(0,0,0,0.25)",
              padding: "30px 20px",
              transition: "background 0.3s ease",
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
                color: isDark ? "#fff" : "#000",
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
                  style={{
                    ...menuStyle,
                    color: isDark ? "#fff" : "#111",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <hr style={{ margin: "12px 0", borderColor: isDark ? "#333" : "#eee" }} />

              <Link
                href="/mimi"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...menuStyle, color: isDark ? "#fff" : "#111" }}
              >
                <img src="/mascot.png" style={{ width: "28px", height: "28px" }} />
                Mimi
              </Link>

              <hr style={{ margin: "12px 0", borderColor: isDark ? "#333" : "#eee" }} />

              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                style={{ ...menuStyle, color: isDark ? "#fff" : "#111" }}
              >
                <User size={24} color="#ec4899" />
                Account
              </Link>
            </div>
          </div>

          <div
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 99999,
            }}
          />
        </>
      )}

      <main style={{ flex: 1, width: "100%" }}>
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
  fontWeight: 600,
  fontSize: "16px",
};