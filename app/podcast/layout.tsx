"use client";

import { LivesProvider } from "@/context/LivesContext";

export default function PodcastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LivesProvider>{children}</LivesProvider>;
}