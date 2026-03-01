export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_FLASHCARD_KEY,
});

export async function GET() {
  try {
    if (!process.env.GEMINI_FLASHCARD_KEY) {
      return NextResponse.json(
        { error: "GEMINI_FLASHCARD_KEY missing in .env.local" },
        { status: 500 }
      );
    }

    const dir = path.join(process.cwd(), "data");

    // ✅ ensure folder exists
    try {
      await fs.access(dir);
    } catch {
      return NextResponse.json(
        { error: "Please upload PDF first." },
        { status: 400 }
      );
    }

    const files = await fs.readdir(dir);

    // ✅ ONLY JSON FILES
    const jsonFiles = files.filter((file) =>
      file.endsWith(".json")
    );

    if (!jsonFiles.length) {
      return NextResponse.json(
        { error: "No processed notes found." },
        { status: 400 }
      );
    }

    // ✅ get latest JSON file
    const sorted = await Promise.all(
      jsonFiles.map(async (file) => {
        const stats = await fs.stat(path.join(dir, file));
        return { file, time: stats.mtime.getTime() };
      })
    );

    sorted.sort((a, b) => b.time - a.time);
    const latestFile = sorted[0].file;

    // ✅ SAFE FILE READ
    const rawData = await fs.readFile(
      path.join(dir, latestFile),
      "utf-8"
    );

    let fileData;

    try {
      fileData = JSON.parse(rawData);
    } catch (err) {
      console.error("Invalid JSON:", latestFile);
      return NextResponse.json(
        { error: "Study notes file corrupted." },
        { status: 500 }
      );
    }

    const documentText = fileData.text?.slice(0, 8000);

    if (!documentText) {
      return NextResponse.json(
        { error: "Document text missing." },
        { status: 400 }
      );
    }

    // ✅ GEMINI CALL
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: `
Generate exactly 5 study flashcards.

Format strictly like this:

Q: Question
A: Answer

TEXT:
${documentText}
`,
    });

    const aiText =
      response.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") || "";

    if (!aiText) {
      return NextResponse.json(
        { error: "AI returned empty response." },
        { status: 500 }
      );
    }

    // ✅ parse flashcards
    const cards = aiText
      .split("Q:")
      .slice(1)
      .map((block) => {
        const [questionPart, answerPart] = block.split("A:");
        return {
          question: questionPart?.trim(),
          answer: answerPart?.trim(),
        };
      })
      .filter((c) => c.question && c.answer);

    if (!cards.length) {
      return NextResponse.json(
        { error: "No flashcards generated." },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcards: cards });

  } catch (error) {
    console.error("FLASHCARD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate flashcards." },
      { status: 500 }
    );
  }
}