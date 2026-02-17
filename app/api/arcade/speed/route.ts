import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function GET() {
  try {
    const notesPath = path.join(
      process.cwd(),
      "data",
      "latest-notes.txt"
    );

    const notes = await fs.readFile(notesPath, "utf-8");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
Create 10 short question-answer pairs from these notes for a speed recall game.
Each question should be answerable in 1-3 words.

Return STRICT JSON ONLY in this format:

{
  "questions": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ]
}

NOTES:
${notes.slice(0, 6000)}
`,
    });

    const text = response.text || "{}";

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    const cleanJSON = text.slice(jsonStart, jsonEnd);

    const data = JSON.parse(cleanJSON);

    return NextResponse.json({ questions: data.questions || [] });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { questions: [], error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
