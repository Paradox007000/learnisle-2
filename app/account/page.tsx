"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useTheme } from "next-themes";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

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

  // 🔥 Random Demo Values
  const xp = 220;
  const files = 12;
  const flashcards = 46;
  const streak = 9;

  const level = Math.floor(xp / 200);
const progress = (xp % 200) / 2; // progress %


  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div
      className="min-h-screen pt-24 px-8 transition-colors duration-300
                 bg-gradient-to-br
                 from-[#fff8fb] via-[#fff0f5] to-[#eef6ff]
                 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-black"
    >
      {/* HEADER */}
      <header
        className="fixed top-0 left-0 right-0 h-20 
                   bg-white dark:bg-[#1E1E1E] 
                   shadow-md flex items-center px-6 z-50 
                   transition-colors duration-300"
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-black dark:text-white font-semibold"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <img
              src="/logo.png"
              alt="Logo"
              className="h-20 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="text-xl dark:text-white"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 bg-[#FFD6E7] 
                         text-black rounded-lg 
                         text-sm font-semibold 
                         shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* USER BOX */}
      <div
        className="bg-gradient-to-r from-[#FFEFF6] via-[#FFE4F0] to-[#FFD6E7]
                   dark:from-[#2A2A2A] dark:via-[#242424] dark:to-[#1E1E1E]
                   rounded-3xl p-7 shadow-lg mb-10 
                   border border-pink-200 dark:border-gray-700
                   flex items-center gap-6"
      >
        <div
          className="w-16 h-16 rounded-full bg-[#FFD6E7] 
                     dark:bg-gray-700
                     text-black dark:text-white
                     flex items-center justify-center 
                     text-xl font-bold shadow-md"
        >
          {user?.displayName?.charAt(0).toUpperCase() ||
            user?.email?.charAt(0).toUpperCase() ||
            "U"}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">
            Hello, {user?.displayName || user?.email?.split("@")[0] || "User"} 👋
          </h1>

          <p className="text-sm text-black dark:text-gray-300 mt-1 font-medium">
            {user?.email}
          </p>

          <p className="mt-2 text-lg font-bold text-black dark:text-white">
            🏆 Level {level} • {xp} XP
          </p>
        </div>
      </div>

      {/* STATS + PROGRESS */}
      <div className="flex gap-16 items-start mb-12">
        <div className="grid grid-cols-2 gap-4 flex-1 max-w-4xl">
          {[
            ["📂 Files Uploaded", files, "files"],
            ["🃏 Flashcards", flashcards, "cards"],
            ["🔥 Streak", streak, "days"],
            ["🌟 XP", xp, "points"],
          ].map(([title, value, sub], i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1E1E1E] rounded-2xl 
                         h-32 w-full flex flex-col justify-center items-start  
                         shadow-md border border-pink-200 dark:border-gray-700 p-5"
            >
              <p className="text-base font-bold text-black dark:text-white">
                {title}
              </p>

              <h2 className="text-3xl font-bold mt-1 text-black dark:text-white">
                {value}
              </h2>

              <p className="text-sm font-semibold text-black/70 dark:text-gray-400 mt-0.5">
                {sub}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-row items-center gap-6">
          <div className="relative w-44 h-44">
            <svg className="w-44 h-44 -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="70"
                stroke="#FCE7F3"
                strokeWidth="14"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r="70"
                stroke="#FF69B4"
                strokeWidth="14"
                fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={440 - (progress / 100) * 440}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-black dark:text-white">
                {Math.round(progress)}%
              </p>
              <p className="text-sm font-semibold text-black dark:text-gray-300">
                📊 Progress
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 shadow-md border border-pink-200 dark:border-gray-700 w-52 flex flex-col items-center">
            <h3 className="text-base font-bold text-black dark:text-white mb-2">
              ⏳ Hours
            </h3>

            <p className="text-lg font-bold text-black dark:text-white mb-2">
              18 H
            </p>

            <div className="flex items-end justify-between h-36 gap-2 w-full">
              {[35, 60, 40, 75, 55, 70, 45].map((height, i) => (
                <div
                  key={i}
                  className="bg-[#FF69B4] rounded-md w-4"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="flex justify-between text-xs text-black/70 dark:text-gray-400 mt-1 w-full">
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
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-md border border-pink-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-black dark:text-white mb-3">
            🏅 Achievements
          </h3>
          <p className="text-sm text-black/70 dark:text-gray-400">
            Completed 10 flashcard sets 🎉
          </p>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-md border border-pink-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-black dark:text-white mb-3">
            📜 Recent Activity
          </h3>
          <p className="text-sm text-black/70 dark:text-gray-400">
            Uploaded 2 new files and practiced flashcards today.
          </p>
        </div>
      </div>
    </div>
  );
}



