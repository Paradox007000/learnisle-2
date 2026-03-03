"use client";

import { LivesProvider } from "@/context/LivesContext";

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LivesProvider>{children}</LivesProvider>;
}