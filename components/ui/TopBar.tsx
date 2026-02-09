"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TopBar() {
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
    {/* Left side — App name */}
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
    width={220}   // you can adjust size later
    height={140}
    style={{ objectFit: "contain" }}
  />
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
    style={{
      objectFit: "cover", // 👈 makes image fill the circle
    }}
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
