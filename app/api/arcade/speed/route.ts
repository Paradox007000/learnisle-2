export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_SPEED_KEY,
});

export async function GET() {
  try {
    console.log("⚡ Speed API called");

    if (!process.env.GEMINI_ARCADE_KEY) {
      return NextResponse.json(
        { error: "GEMINI_ARCADE_KEY missing" },
        { status: 500 }
      );
    }

    // -----------------------------
    // 1️⃣ Read latest-notes.txt
    // -----------------------------
    const notesPath = path.join(
      process.cwd(),
      "data",
      "latest-notes.txt"
    );

    let documentText = "";

    try {
      documentText = await fs.readFile(notesPath, "utf-8");
    } catch {
      console.log("❌ latest-notes.txt not found");

      return NextResponse.json(
        { error: "No study notes found. Generate notes first." },
        { status: 404 }
      );
    }

    if (!documentText.trim()) {
      return NextResponse.json(
        { error: "Notes file empty." },
        { status: 400 }
      );
    }

    console.log("📏 Notes length:", documentText.length);

    // -----------------------------
    // 2️⃣ Generate questions (Gemini)
    // -----------------------------
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: `
Create EXACTLY 5 SPEED RECALL questions.

Rules:
- answers must be VERY SHORT (1–3 words)
- no explanations
- fast recall questions only

FORMAT STRICTLY:

Q: question
A: answer

TEXT:
${documentText.slice(0, 8000)}
`,
    });

    const aiText =
      response.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") || "";

    if (!aiText) {
      throw new Error("Empty AI response");
    }

    // -----------------------------
    // 3️⃣ Parse output
    // -----------------------------
    const questions = aiText
      .split("Q:")
      .slice(1)
      .map((block) => {
        const [q, a] = block.split("A:");

        return {
          question: q?.trim(),
          answer: a?.trim(),
        };
      })
      .filter((q) => q.question && q.answer);

    if (!questions.length) {
      throw new Error("No questions parsed");
    }

    console.log("✅ Speed questions generated");

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("SPEED ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate speed questions." },
      { status: 500 }
    );
  }
}
