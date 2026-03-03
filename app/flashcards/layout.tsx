"use client";

import { LivesProvider } from "@/context/LivesContext";

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LivesProvider>{children}</LivesProvider>;
}