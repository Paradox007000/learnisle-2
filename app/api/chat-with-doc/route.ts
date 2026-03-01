export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const dir = path.join(process.cwd(), "data");
    const files = await fs.readdir(dir);

    // ✅ ONLY allow JSON files
    const jsonFiles = files.filter((file) =>
      file.endsWith(".json")
    );

    if (!jsonFiles.length) {
      return NextResponse.json({
        answer: "No study notes found.",
      });
    }

    // ✅ find latest JSON file
    const sorted = await Promise.all(
      jsonFiles.map(async (file) => {
        const stats = await fs.stat(path.join(dir, file));
        return { file, time: stats.mtime.getTime() };
      })
    );

    sorted.sort((a, b) => b.time - a.time);
    const latestFile = sorted[0].file;

    // ✅ read safely
    const rawData = await fs.readFile(
      path.join(dir, latestFile),
      "utf-8"
    );

    let fileData;

    try {
      fileData = JSON.parse(rawData);
    } catch (err) {
      console.error("Invalid JSON file:", latestFile);
      return NextResponse.json({
        answer: "Study notes file is corrupted.",
      });
    }

    const limitedText = fileData.text?.slice(0, 10000) || "";

    if (!limitedText) {
      return NextResponse.json({
        answer: "No study notes content found.",
      });
    }

    // ✅ Gemini request (UNCHANGED LOGIC)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are a helpful study assistant.
Only answer using the document content below.

DOCUMENT:
${limitedText}

QUESTION:
${question}
`,
    });

    return NextResponse.json({
      answer: response.text,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return NextResponse.json({
      answer: "AI failed to respond.",
    });
  }
}