export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const dir = path.join(process.cwd(), "data");
    const files = await fs.readdir(dir);

    if (!files.length) {
      return NextResponse.json({ answer: "No document found." });
    }

    // Get latest uploaded document
    const sorted = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(path.join(dir, file));
        return { file, time: stats.mtime.getTime() };
      })
    );

    sorted.sort((a, b) => b.time - a.time);
    const latestFile = sorted[0].file;

    const fileData = JSON.parse(
      await fs.readFile(path.join(dir, latestFile), "utf-8")
    );

    const limitedText = fileData.text.slice(0, 10000);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are a helpful study assistant. Only answer using the document content below.

DOCUMENT:
${limitedText}

QUESTION:
${question}
`,
    });

    return NextResponse.json({ answer: response.text });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json({ answer: "AI failed to respond." });
  }
}
