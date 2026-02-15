"use client";

import Link from "next/link";
import { Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";
import React from "react";

interface MenuDrawerProps {
  isOpen: boolean;
  closeMenu: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, closeMenu }) => {
  if (!isOpen) return null;

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
    transition: "all 0.2s ease",
  };

  const menuItems = [
    { href: "/", label: "Home", icon: <Home size={24} strokeWidth={2.5} color="#ec4899" /> },
    { href: "/arcade", label: "Arcade", icon: <Gamepad2 size={24} strokeWidth={2.5} color="#ec4899" /> },
    { href: "/document", label: "Document", icon: <FileText size={24} strokeWidth={2.5} color="#ec4899" /> },
    { href: "/podcast", label: "Podcast", icon: <Mic size={24} strokeWidth={2.5} color="#ec4899" /> },
    { href: "/flashcards", label: "Flashcards", icon: <CreditCard size={24} strokeWidth={2.5} color="#ec4899" /> },
  ];

  return (
    <>
      {/* DRAWER */}
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
        {/* CLOSE BUTTON */}
        <button
          onClick={closeMenu}
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

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "40px" }}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={closeMenu}
              style={menuStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(128,128,128,0.08)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {item.icon} {item.label}
            </Link>
          ))}

          <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

          <Link
            href="/mimi"
            onClick={closeMenu}
            style={menuStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(128,128,128,0.08)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img
              src="/mascot.png"
              alt="Mascot"
              style={{ width: "28px", height: "28px", objectFit: "contain" }}
            />
            Mimi
          </Link>

          <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

          <Link
            href="/account"
            onClick={closeMenu}
            style={menuStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(128,128,128,0.08)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <User size={24} strokeWidth={2.5} color="#ec4899" /> Account
          </Link>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        onClick={closeMenu}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.4)",
          zIndex: 99999,
        }}
      />
    </>
  );
};
