export const runtime = "nodejs";

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST() {
  try {
    // 🔹 Get AI notes (correct route)
    const notesRes = await fetch("http://localhost:3000/api/generate-notes", {
      method: "POST",
    });

    const data = await notesRes.json();
    const notesText = data.notes?.slice(0, 2500) || "No notes available.";

    // 🔹 ElevenLabs Text-to-Dialogue
    const audio = await elevenlabs.textToDialogue.convert({
      inputs: [
        {
          text: notesText,
          voiceId: "cgSgspJ2msm6clMCkdW9", // your chosen voice
        },
      ],
    });

    return new Response(audio, {
      headers: { "Content-Type": "audio/mpeg" },
    });

  } catch (error) {
    console.error("Podcast Error:", error);
    return NextResponse.json(
      { error: "Failed to generate podcast" },
      { status: 500 }
    );
  }
}
