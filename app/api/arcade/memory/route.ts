export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_ARCADE_KEY,
});

export async function GET() {
  try {
    console.log("🧠 Memory API called");

    if (!process.env.GEMINI_ARCADE_KEY) {
      return NextResponse.json(
        { error: "GEMINI_ARCADE_KEY missing" },
        { status: 500 }
      );
    }

    // -----------------------------
    // 1️⃣ Read notes
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
        { error: "Generate notes first." },
        { status: 404 }
      );
    }

    if (!documentText.trim()) {
      return NextResponse.json(
        { error: "Notes empty." },
        { status: 400 }
      );
    }

    // -----------------------------
    // 2️⃣ Gemini generate pairs
    // -----------------------------
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: `
Create EXACTLY 3 study flashcard pairs.

Rules:
- short questions
- short answers (1–4 words)
- no explanations

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

    if (!aiText) throw new Error("Empty AI response");

    // -----------------------------
    // 3️⃣ Parse output safely
    // -----------------------------
    const pairs = aiText
      .split("Q:")
      .slice(1)
      .map((block) => {
        const [q, a] = block.split("A:");

        return {
          question: q?.trim(),
          answer: a?.trim(),
        };
      })
      .filter((p) => p.question && p.answer);

    if (!pairs.length) {
      throw new Error("No pairs parsed");
    }

    console.log("✅ Memory pairs generated");

    return NextResponse.json({ pairs });
  } catch (error) {
    console.error("MEMORY ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate memory game." },
      { status: 500 }
    );
  }
}
