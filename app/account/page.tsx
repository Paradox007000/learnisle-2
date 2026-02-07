"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowLeft } from "lucide-react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const xp = 0;
  const level = 1;
  const progress = 0;

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] dark:bg-zinc-900 px-8 py-8 transition">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">

        {/* Back */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[#6b4f3b] font-semibold"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-11 h-11 rounded-full bg-white dark:bg-zinc-800 
                       shadow-md flex items-center justify-center text-lg"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 bg-[#8b5e3c] text-white rounded-lg text-sm font-semibold shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* USER BOX */}
      <div className="bg-gradient-to-r from-[#f3e5d8] via-[#ecd7c5] to-[#e6c8b0]
                      rounded-3xl p-7 shadow-lg mb-10 
                      border border-[#8b5e3c]/20 flex items-center gap-6">

        <div className="w-16 h-16 rounded-full bg-[#8b5e3c] 
                        text-white flex items-center justify-center 
                        text-xl font-bold shadow-md">
          {user?.displayName?.charAt(0).toUpperCase() ||
            user?.email?.charAt(0).toUpperCase() ||
            "U"}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#6b4f3b] tracking-tight">
            Hello, {user?.displayName || user?.email?.split("@")[0] || "User"} 👋
          </h1>

          <p className="text-sm text-zinc-700 mt-1 font-medium">
            {user?.email}
          </p>

          <p className="mt-2 text-lg font-bold text-[#8b5e3c]">
            🏆 Level {level} • {xp} XP
          </p>
        </div>
      </div>

      {/* STATS + PROGRESS */}
      <div className="flex gap-16 items-start mb-12">

 {/* 4 Horizontal Rectangular Boxes */}
<div className="grid grid-cols-2 gap-4 flex-1 max-w-4xl">

  {[
    ["📂 Files Uploaded", 0, "files"],
    ["🃏 Flashcards", 0, "cards"],
    ["🔥 Streak", 0, "days"],
    ["🎯 Accuracy", "0%", "rate"],
  ].map(([title, value, sub], i) => (
    <div
      key={i}
      className="bg-white rounded-2xl 
                 h-32 w-full  
                 flex flex-col justify-center items-start  
                 shadow-md border border-[#8b5e3c]/20 p-5"
    >
      <p className="text-base font-bold text-[#6b4f3b]">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-1 text-[#8b5e3c]">
        {value}
      </h2>

      <p className="text-sm font-semibold text-[#6b4f3b]/70 mt-0.5">
        {sub}
      </p>
    </div>
  ))}
</div>

        {/* RIGHT SIDE: Progress + Hours beside it */}
        <div className="flex flex-row items-center gap-6">

          {/* Progress Circle */}
          <div className="relative w-44 h-44">

            <svg className="w-44 h-44 -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="70"
                stroke="#e8ded6"
                strokeWidth="14"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r="70"
                stroke="#8b5e3c"
                strokeWidth="14"
                fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={440 - (progress / 100) * 440}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-[#8b5e3c]">
                {progress}%
              </p>
              <p className="text-sm font-semibold text-[#6b4f3b]">
                📊 Progress
              </p>
            </div>
          </div>

          {/* Hours Spent Box (slightly bigger width) */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-[#8b5e3c]/20 w-52 flex flex-col items-center">

            <h3 className="text-base font-bold text-[#6b4f3b] mb-2">
              ⏳ Hours
            </h3>

            <p className="text-lg font-bold text-[#8b5e3c] mb-2">
              0 H
            </p>

            <div className="flex items-end justify-between h-36 gap-2 w-full">
              {[10, 20, 15, 25, 18, 22, 12].map((height, i) => (
                <div
                  key={i}
                  className="bg-[#8b5e3c]/60 rounded-md w-4"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="flex justify-between text-xs text-[#6b4f3b]/70 mt-1 w-full">
              <span>Su</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

          </div>

        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-6">

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#8b5e3c]/20">
          <h3 className="text-xl font-bold text-[#6b4f3b] mb-3">
            🏅 Achievements
          </h3>
          <p className="text-sm text-zinc-600">
            No achievements yet.
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#8b5e3c]/20">
          <h3 className="text-xl font-bold text-[#6b4f3b] mb-3">
            📜 Recent Activity
          </h3>
          <p className="text-sm text-zinc-600">
            No activity yet.
          </p>
        </div>

      </div>

    </div>
  );
}




