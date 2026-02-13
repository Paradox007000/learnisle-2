"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TopBarProps {
  openMenu?: () => void; // optional so it won’t break other pages
}

export default function TopBar({ openMenu }: TopBarProps) {
  const router = useRouter();

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
      {/* Left side — Menu + Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        
        {/* ☰ Menu Button (only works if prop passed) */}
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

      {/* Right side — Mascot + Mimi */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
      </div>
    </div>
  );
}
