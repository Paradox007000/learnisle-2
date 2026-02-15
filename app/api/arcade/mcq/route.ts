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
Create ONE multiple choice question from these notes.

Return STRICT JSON ONLY in this format:

{
 "question": "",
 "options": ["A","B","C","D"],
 "answer": ""
}

NOTES:
${notes.slice(0, 6000)}
`,
    });

    const text = response.text || "{}";

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    const cleanJSON = text.slice(jsonStart, jsonEnd);

    const question = JSON.parse(cleanJSON);

    return NextResponse.json(question);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to generate MCQ" },
      { status: 500 }
    );
  }
}
