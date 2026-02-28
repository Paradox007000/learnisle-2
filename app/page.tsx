"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ ADDED
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #FFF6EC 0%, #E6F7F2 50%, #FDE2F3 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 🌐 TOP NAV */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
        }}
      >
        {/* Left Logo */}
        <Image
          src="/logo.png"
          alt="Learnisle Logo"
          width={180}
          height={60}
          style={{ objectFit: "contain" }}
        />

        {/* Right Side */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>

          <button
            onClick={() => router.push("/signup")}
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: "none",
              background:
                "linear-gradient(90deg,#6EE7B7,#FFB7D5)",
              color: "#2F3E34",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            {t.signup}
          </button>
        </div>
      </div>

      {/* 🌸 HERO SECTION */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {/* Big Title */}
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            background:
              "linear-gradient(90deg,#6EE7B7,#FFB7D5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
          }}
        >
          {t.title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "18px",
            maxWidth: "600px",
            color: "#2F3E34",
            marginBottom: "40px",
          }}
        >
          {t.subtitle}
        </p>

        {/* Mascot */}
        <Image
          src="/mascot2.png"
          alt="Mascot"
          width={150}
          height={150}
          style={{ marginBottom: "30px" }}
        />

        {/* Start Button */}
        {!loading ? (
          <button
            onClick={handleStart}
            style={{
              padding: "14px 42px",
              fontSize: "18px",
              borderRadius: "999px",
              border: "none",
              background:
                "linear-gradient(90deg,#FFB7D5,#6EE7B7)",
              color: "#2F3E34",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              transition: "transform 0.1s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.96)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            {t.start}
          </button>
        ) : (
          <p style={{ marginTop: "20px" }}>
            {t.loading}
          </p>
        )}
      </div>
    </div>
  );
}