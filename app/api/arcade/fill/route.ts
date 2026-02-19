export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_QUIZ_KEY,
});

export async function GET() {
  try {
    console.log("✏️ Fill Blank API called");

    if (!process.env.GEMINI_QUIZ_KEY) {
      return NextResponse.json(
        { error: "GEMINI_QUIZ_KEY missing" },
        { status: 500 }
      );
    }

    // -----------------------------
    // Read notes
    // -----------------------------
    const notesPath = path.join(
      process.cwd(),
      "data",
      "latest-notes.txt"
    );

    let notes = "";

    try {
      notes = await fs.readFile(notesPath, "utf-8");
    } catch {
      console.log("❌ latest-notes.txt not found");

      return NextResponse.json(
        { error: "Generate notes first." },
        { status: 404 }
      );
    }

    // -----------------------------
    // Generate blanks
    // -----------------------------
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: `
Create EXACTLY 5 fill-in-the-blank questions.

Rules:
- Replace ONE keyword with _____
- Answers must be SHORT (1–3 words)
- No explanations

FORMAT STRICTLY:

Q: sentence with _____
A: answer

TEXT:
${notes.slice(0, 8000)}
`,
    });

    const aiText =
      response.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") || "";

    if (!aiText) throw new Error("Empty AI response");

    // -----------------------------
    // Parse
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

    if (!questions.length)
      throw new Error("No questions parsed");

    console.log("✅ Fill blanks generated");

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("FILL ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate blanks." },
      { status: 500 }
    );
  }
}
