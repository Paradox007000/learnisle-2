export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { mimiSystemPrompt } from "@/lib/mimiContext";

// Gemini client (uses GEMINI_API_KEY automatically)
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { reply: "Please say something 😊" },
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
      response.text || "I'm here to help! ✨";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Mimi Chat Error:", error);

    return NextResponse.json(
      { reply: "Mimi is having trouble right now 😭" },
      { status: 500 }
    );
  }
}
