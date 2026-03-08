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

    if (!process.env.GEMINI_MCQ_KEY) {
      return NextResponse.json(
        { error: "GEMINI_MCQ_KEY missing" },
        { status: 500 }
      );
    }

    const notesPath = path.join(
      process.cwd(),
      "data",
      "latest-notes.txt"
    );

    let notes = "";

    try {
      notes = await fs.readFile(notesPath, "utf-8");
    } catch {
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

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: `
Create EXACTLY 5 multiple choice questions.

RULES:
- 4 options per question
- Only ONE correct answer
- Options must be short
- No explanations
- Based strictly on notes

RETURN STRICT JSON ONLY:

{
 "questions": [
  {
   "question": "string",
   "options": ["A","B","C","D"],
   "answer": "exact correct option text"
  }
 ]
}

NOTES:
${notes.slice(0, 8000)}
`,
    });

    const aiText =
      response.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") || "";

    const start = aiText.indexOf("{");
    const end = aiText.lastIndexOf("}") + 1;
    const cleanJSON = aiText.slice(start, end);

    const parsed = JSON.parse(cleanJSON);

    if (!parsed.questions || parsed.questions.length === 0) {
      throw new Error("Invalid MCQ format");
    }

    console.log("✅ MCQs generated");

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("MCQ ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate MCQ." },
      { status: 500 }
    );
  }
}