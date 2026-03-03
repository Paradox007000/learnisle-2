"use client";

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

  /* -----------------------------
     PAGE DETECTION
  ----------------------------- */

  // ❤️ Arcade pages
  const showLives = pathname.includes("/arcade");

  // ⏰ Learning pages (works with nested routes)
  const learningRoutes = ["/document", "/podcast", "/flashcards"];

  const showLearningTimer = learningRoutes.some((route) =>
    pathname.includes(route)
  );

  return (
    <div
      style={{
        height: "100px",
        background: "#F6FFF8",
        borderBottom: "1px solid #E0F2E9",
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
            }}
          >
            ☰
          </button>
        )}

        {/* Logo */}
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
        {/* ❤️ Arcade Lives */}
        {showLives && <Hearts />}

        {/* ⏰ Study Timer */}
        {showLearningTimer && <LifeTimer />}

        {/* Mimi */}
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
                background: "#ffeef5",
                border: "2px solid #ffd6e7",
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
                color: "#2F3E34",
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