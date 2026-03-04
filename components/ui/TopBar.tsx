"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Hearts from "@/components/ui/Hearts";
import LifeTimer from "@/components/ui/LifeTimer";

interface TopBarProps {
  openMenu?: () => void;
  hideMimi?: boolean;
}

export default function TopBar({
  openMenu,
  hideMimi = false,
}: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();

    const { theme } = useTheme();
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;

const isDark = theme === "dark";

  /* -----------------------------
     PAGE DETECTION
  ----------------------------- */

  const showLives = pathname.includes("/arcade");

  const learningRoutes = ["/document", "/podcast", "/flashcards"];

  const showLearningTimer = learningRoutes.some((route) =>
    pathname.includes(route)
  );

  return (
    <div
      style={{
        height: "100px",
        background: isDark ? "#1E1E1E" : "#F6FFF8",
        borderBottom: isDark
          ? "1px solid #2A2A2A"
          : "1px solid #E0F2E9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
      }}
    >
      {/* =========================
         LEFT SIDE — MENU + LOGO
      ========================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {openMenu && (
          <button
            onClick={openMenu}
            style={{
              fontSize: "28px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isDark ? "#ffffff" : "#000000",
            }}
          >
            ☰
          </button>
        )}

        <div
          onClick={() => router.push("/dashboard")}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src="/logo.png"
            alt="Learnisle logo"
            width={220}
            height={140}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* =========================
         RIGHT SIDE
      ========================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {showLives && <Hearts />}

        {showLearningTimer && <LifeTimer />}

        {!hideMimi && (
          <Link
            href="/mimi"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                overflow: "hidden",
                background: isDark ? "#2A2A2A" : "#ffeef5",
                border: isDark
                  ? "2px solid #3A3A3A"
                  : "2px solid #ffd6e7",
                position: "relative",
              }}
            >
              <Image
                src="/mascot.png"
                alt="Mimi mascot"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: isDark ? "#ffffff" : "#2F3E34",
              }}
            >
              Mimi
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}