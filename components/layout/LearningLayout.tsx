"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

type Props = {
children: ReactNode;
};

export default function LearningLayout({ children }: Props) {

const pathname = usePathname();

// get page name from URL
const pageName =
pathname.split("/").filter(Boolean).pop() || "Learning";

// format title
const title =
pageName.charAt(0).toUpperCase() + pageName.slice(1);

return (
<div
className="min-h-screen bg-cover bg-center flex flex-col"
style={{ backgroundImage: "url('/bg-4.png')" }}
>

  {/* TOP BAR */}
  <div className="w-full flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-md border-b border-white/30">

    {/* logo */}
    <div className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="logo"
        width={110}
        height={40}
      />
    </div>

    {/* right side */}
    <div className="flex items-center gap-4">

      {/* hearts */}
      <Image
        src="/images/arcade/hearts.gif"
        alt="hearts"
        width={32}
        height={32}
      />

      {/* profile */}
      <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center text-white font-bold">
        U
      </div>

    </div>
  </div>

  {/* PAGE BODY */}
  <div className="flex-1 flex items-center justify-center px-6">

    <div className="w-full max-w-5xl bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200 p-10">

      {/* TITLE */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pink-600">
          {title}
        </h1>

        <p className="text-gray-600 mt-1">
          Continue your learning journey
        </p>
      </div>

      {/* PAGE CONTENT */}
      {children}

    </div>

  </div>

</div>

);
}