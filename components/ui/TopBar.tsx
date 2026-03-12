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
        height: "90px",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        background: isDark
          ? "rgba(25,25,25,0.65)"
          : "rgba(255,255,255,0.55)",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
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
              fontSize: "26px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isDark ? "#ffffff" : "#1f2937",
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
            width={200}
            height={120}
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
          gap: "26px",
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
              gap: "12px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                overflow: "hidden",
                background: isDark
                  ? "rgba(60,60,60,0.6)"
                  : "rgba(255,230,240,0.8)",
                border: "1px solid rgba(255,255,255,0.4)",
                backdropFilter: "blur(10px)",
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
                fontSize: "18px",
                fontWeight: 500,
                color: isDark ? "#ffffff" : "#2F3E34",
                opacity: 0.9,
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