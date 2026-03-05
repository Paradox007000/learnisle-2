export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_MCQ_KEY,
});

export async function GET() {
  try {
    console.log("🧠 MCQ API called");

    // -----------------------------
    // 1️⃣ Check API key
    // -----------------------------
    if (!process.env.GEMINI_QUIZ_KEY) {
      return NextResponse.json(
        { error: "GEMINI_QUIZ_KEY missing" },
        { status: 500 }
      );
    }

    // -----------------------------
    // 2️⃣ Read notes
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

    if (!notes.trim()) {
      return NextResponse.json(
        { error: "Notes file empty." },
        { status: 400 }
      );
    }

    console.log("📏 Notes length:", notes.length);

    // -----------------------------
    // 3️⃣ Gemini Generate MCQ
    // -----------------------------
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: `
Create EXACTLY ONE multiple choice question.

RULES:
- 4 options only
- Only ONE correct answer
- Options must be short
- No explanations
- Based strictly on notes

RETURN STRICT JSON ONLY:

{
 "question": "string",
 "options": ["A","B","C","D"],
 "answer": "exact correct option text"
}

NOTES:
${notes.slice(0, 8000)}
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
    // 4️⃣ Safe JSON extraction
    // -----------------------------
    const start = aiText.indexOf("{");
    const end = aiText.lastIndexOf("}") + 1;

    const cleanJSON = aiText.slice(start, end);

    const parsed = JSON.parse(cleanJSON);

    // validation (VERY IMPORTANT)
    if (
      !parsed.question ||
      !Array.isArray(parsed.options) ||
      parsed.options.length !== 4 ||
      !parsed.answer
    ) {
      throw new Error("Invalid MCQ format");
    }

    console.log("✅ MCQ generated");

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("MCQ ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate MCQ." },
      { status: 500 }
    );
  }
}
