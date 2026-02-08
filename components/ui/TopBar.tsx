"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  return (
    <div
      style={{
        height: "64px",
        background: "#F6FFF8", // pastel mint
        borderBottom: "1px solid #E0F2E9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Left side — App name */}
      <h1
        onClick={() => router.push("/dashboard")}
        style={{
          fontSize: "20px",
          fontWeight: 600,
          cursor: "pointer",
          color: "#2F3E34",
        }}
      >
        Learnisle
      </h1>

      {/* Right side — Mascot + Mimi */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Image
          src="/mascot.png"
          alt="Mimi mascot"
          width={36}
          height={36}
          style={{ borderRadius: "50%" }}
        />
        <span style={{ fontWeight: 500, color: "#2F3E34" }}>Mimi</span>
      </div>
    </div>
  );
}
