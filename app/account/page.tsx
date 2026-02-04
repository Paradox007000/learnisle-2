"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

/* ---------- Helpers ---------- */

const XP_PER_LEVEL = 500;
const getLevel = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

const getWeeklyMessage = (streak: number) => {
  if (streak >= 7) return "🔥 On Fire!";
  if (streak >= 3) return "⚡ Going Strong";
  return "🌱 Just Started";
};

/* ---------- Page ---------- */

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      const today = new Date().toISOString().slice(0, 10);

      if (!snap.exists()) {
        await setDoc(ref, { xp: 50, streak: 1, lastActive: today });
        setXp(50);
        setStreak(1);
        return;
      }

      const data = snap.data();
      let newStreak = data.streak || 0;

      if (data.lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const y = yesterday.toISOString().slice(0, 10);

        newStreak = data.lastActive === y ? newStreak + 1 : 1;

        await updateDoc(ref, {
          streak: newStreak,
          lastActive: today,
          xp: (data.xp || 0) + 50,
        });
      }

      setXp(data.xp || 0);
      setStreak(newStreak);
    });

    return () => unsub();
  }, [router]);

  if (!user) return null;

  const level = getLevel(xp);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 24,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Account</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 14, color: "#6b7280" }}>
            {user.email}
          </span>
          <button
            onClick={async () => {
              await signOut(auth);
              router.push("/login");
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 16,
          border: "1px solid #e5e7eb",
          marginBottom: 24,
        }}
      >
        <div style={{ fontWeight: 600 }}>{user.email}</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Joined {new Date(user.metadata.creationTime || "").toDateString()}
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        <StatBox emoji="🔥" title="Day Streak" value={streak} />
        <StatBox emoji="⚡" title="Total XP" value={xp} />
        <StatBox emoji="👑" title="Level" value={level} />
        <StatBox
          emoji="📅"
          title="Weekly Status"
          value={getWeeklyMessage(streak)}
          text
        />
      </div>
    </div>
  );
}

/* ---------- STAT BOX ---------- */

function StatBox({
  emoji,
  title,
  value,
  text = false,
}: {
  emoji: string;
  title: string;
  value: number | string;
  text?: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 20,
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: 26 }}>{emoji}</div>
      <div
        style={{
          fontSize: text ? 16 : 24,
          fontWeight: 600,
          marginTop: 6,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
        {title}
      </div>
    </div>
  );
}

