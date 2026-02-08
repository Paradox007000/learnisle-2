export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "data");

    // Check if data folder exists
    try {
      await fs.access(dir);
    } catch {
      return NextResponse.json(
        { error: "Please upload PDF first." },
        { status: 400 }
      );
    }

    const files = await fs.readdir(dir);

    if (!files.length) {
      return NextResponse.json(
        { error: "Please upload PDF first." },
        { status: 400 }
      );
    }

    // Get latest file
    const sorted = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        return { file, time: stats.mtime.getTime() };
      })
    );

    sorted.sort((a, b) => b.time - a.time);

    const latestFile = sorted[0].file;

    const fileData = JSON.parse(
      await fs.readFile(path.join(dir, latestFile), "utf-8")
    );

    const documentText = fileData.text?.slice(0, 8000);

    if (!documentText) {
      return NextResponse.json(
        { error: "Document text missing." },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `
Generate 5 study flashcards from this text.

Return ONLY in this format:

Q: Question here
A: Answer here

TEXT:
${documentText}
`,
    });

    const aiText =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

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

    return NextResponse.json({ flashcards: cards });
  } catch (error) {
    console.error("FLASHCARD ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards." },
      { status: 500 }
    );
  }
}



