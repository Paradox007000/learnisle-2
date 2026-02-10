"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
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
    <div className="min-h-screen bg-[#FFF9F2] px-8 py-8">

      {/* TOP BAR */}
<div className="flex justify-between items-center mb-6">

  {/* Left Side - Back + Logo */}
  <div className="flex items-center gap-4">

    {/* Back */}
    <button
      onClick={() => router.push("/dashboard")}
      className="flex items-center gap-2 text-black font-semibold"
    >
      <ArrowLeft size={18} />
      Back
    </button>

   

  </div>

  {/* Logout */}
  <button
    onClick={logout}
    className="px-4 py-2 bg-[#FFD6E7] text-black rounded-lg text-sm font-semibold shadow-md"
  >
    Logout
  </button>

</div>



      {/* USER BOX */}
      <div className="bg-gradient-to-r from-[#FFEFF6] via-[#FFE4F0] to-[#FFD6E7]
                      rounded-3xl p-7 shadow-lg mb-10 
                      border border-pink-200 flex items-center gap-6">

        <div className="w-16 h-16 rounded-full bg-[#FFD6E7] 
                        text-black flex items-center justify-center 
                        text-xl font-bold shadow-md">
          {user?.displayName?.charAt(0).toUpperCase() ||
            user?.email?.charAt(0).toUpperCase() ||
            "U"}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">
            Hello, {user?.displayName || user?.email?.split("@")[0] || "User"} 👋
          </h1>

          <p className="text-sm text-black mt-1 font-medium">
            {user?.email}
          </p>

          <p className="mt-2 text-lg font-bold text-black">
            🏆 Level {level} • {xp} XP
          </p>
        </div>
      </div>

      {/* STATS + PROGRESS */}
      <div className="flex gap-16 items-start mb-12">

        {/* 4 Boxes */}
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
                         shadow-md border border-pink-200 p-5"
            >
              <p className="text-base font-bold text-black">
                {title}
              </p>

              <h2 className="text-3xl font-bold mt-1 text-black">
                {value}
              </h2>

              <p className="text-sm font-semibold text-black/70 mt-0.5">
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-row items-center gap-6">

          {/* Progress Circle */}
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
                stroke="#FFD6E7"
                strokeWidth="14"
                fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={440 - (progress / 100) * 440}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-black">
                {progress}%
              </p>
              <p className="text-sm font-semibold text-black">
                📊 Progress
              </p>
            </div>
          </div>

          {/* Hours Box */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-pink-200 w-52 flex flex-col items-center">

            <h3 className="text-base font-bold text-black mb-2">
              ⏳ Hours
            </h3>

            <p className="text-lg font-bold text-black mb-2">
              0 H
            </p>

            <div className="flex items-end justify-between h-36 gap-2 w-full">
              {[10, 20, 15, 25, 18, 22, 12].map((height, i) => (
                <div
                  key={i}
                  className="bg-[#FFD6E7] rounded-md w-4"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="flex justify-between text-xs text-black/70 mt-1 w-full">
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

        <div className="bg-white rounded-2xl p-6 shadow-md border border-pink-200">
          <h3 className="text-xl font-bold text-black mb-3">
            🏅 Achievements
          </h3>
          <p className="text-sm text-black/70">
            No achievements yet.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-pink-200">
          <h3 className="text-xl font-bold text-black mb-3">
            📜 Recent Activity
          </h3>
          <p className="text-sm text-black/70">
            No activity yet.
          </p>
        </div>

      </div>

    </div>
  );
}



