export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Gemini client (reads GEMINI_API_KEY automatically)
const ai = new GoogleGenAI({});

export async function POST() {
  try {
    const dir = path.join(process.cwd(), "data");

    /* ------------------------------------------------ */
    /* 📂 READ ONLY VALID DOCUMENT FILES                */
    /* ------------------------------------------------ */

    const allFiles = await fs.readdir(dir);

    // ✅ only uploaded PDF JSON files
    const jsonFiles = allFiles.filter((file) =>
      file.endsWith(".json")
    );

    if (jsonFiles.length === 0) {
      return NextResponse.json(
        { error: "No uploaded documents found" },
        { status: 404 }
      );
    }

    /* ------------------------------------------------ */
    /* 🕒 FIND MOST RECENT VALID DOCUMENT               */
    /* ------------------------------------------------ */

    const sorted = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);

        return {
          file,
          time: stats.mtime.getTime(),
        };
      })
    );

    sorted.sort((a, b) => b.time - a.time);

    let fileData: any = null;
    let latestFile = "";

    // ✅ find FIRST valid JSON with text
    for (const item of sorted) {
      try {
        const filePath = path.join(dir, item.file);
        const content = await fs.readFile(filePath, "utf-8");
        const parsed = JSON.parse(content);

        if (parsed?.text && parsed.text.trim().length > 50) {
          fileData = parsed;
          latestFile = item.file;
          break;
        }
      } catch {
        console.log("⚠️ Skipping invalid file:", item.file);
      }
    }

    if (!fileData) {
      throw new Error("No valid document text found");
    }

    console.log("📄 Using document:", latestFile);
    console.log("📏 Extracted text length:", fileData.text.length);

    /* ------------------------------------------------ */
    /* ✂️ LIMIT TEXT FOR GEMINI                         */
    /* ------------------------------------------------ */

    const limitedText = fileData.text.slice(0, 12000);

    if (!limitedText.trim()) {
      throw new Error("Document text empty after slicing");
    }

    console.log("📄 Sending text to Gemini...");

    /* ------------------------------------------------ */
    /* 🤖 GEMINI CALL                                  */
    /* ------------------------------------------------ */

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are a helpful tutor.

Convert the following into:
• Easy study notes
• Bullet points
• Short explanations for learning.

ONLY use the provided text.

TEXT:
${limitedText}
`,
    });

    const notes =
      response.text?.trim() || "No notes generated.";

    /* ------------------------------------------------ */
    /* 💾 SAVE NOTES FOR PODCAST + DOCUMENT PAGE        */
    /* ------------------------------------------------ */

    const notesPath = path.join(
      process.cwd(),
      "data",
      "latest-notes.txt"
    );

    await fs.writeFile(notesPath, notes, "utf-8");

    console.log("💾 Notes saved successfully");
    console.log("🧠 Notes preview:", notes.slice(0, 200));

    /* ------------------------------------------------ */
    /* ✅ RESPONSE                                      */
    /* ------------------------------------------------ */

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("NOTES ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate notes" },
      { status: 500 }
    );
  }
}
