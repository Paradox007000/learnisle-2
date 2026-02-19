export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { mimiSystemPrompt } from "@/lib/mimiContext";

/* -------------------------------- */
/* ✅ USE MIMI-SPECIFIC API KEY     */
/* -------------------------------- */

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_MIMI_KEY, // 👈 NEW KEY
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { reply: "Please say something " },
        { status: 400 }
      );
    }

    /* -------------------------------- */
    /* 🤖 GEMINI CHAT                   */
    /* -------------------------------- */

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
${mimiSystemPrompt}

User message:
${message}
`,
    });

    const reply =
      response.text || "I'm here to help!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Mimi Chat Error:", error);

    return NextResponse.json(
      { reply: "Mimi is having trouble right now " },
      { status: 500 }
    );
  }
}
