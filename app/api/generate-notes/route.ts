export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Gemini client reads API key from GEMINI_API_KEY automatically
const ai = new GoogleGenAI({});

export async function POST() {
  try {
    const dir = path.join(process.cwd(), "data");
    const files = await fs.readdir(dir);

    if (!files.length) {
      return NextResponse.json({ error: "No documents found" }, { status: 404 });
    }

    // 📂 Get most recently uploaded document
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

    const limitedText = fileData.text.slice(0, 12000);

    console.log("📄 Sending text to Gemini...");

    // 🤖 Gemini AI call (official SDK)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // from Google docs example you found
      contents: `You are a helpful tutor. Convert the following into:
• Easy study notes
• Bullet points
• Short explanations for learning

TEXT:
${limitedText}`,
    });

    const notes = response.text || "No notes generated.";
    // 💾 Save notes for podcast feature
const notesPath = path.join(process.cwd(), "data", "latest-notes.txt");
await fs.writeFile(notesPath, notes, "utf-8");
console.log("💾 Notes saved for podcast");


    console.log("🧠 Notes preview:", notes.slice(0, 200));

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("NOTES ERROR:", error);
    return NextResponse.json({ error: "Failed to generate notes" }, { status: 500 });
  }
}
