export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// 👇 IMPORTANT — dynamic require for compatibility
const pdfParse = require("pdf-parse");

interface Flashcard {
  question: string;
  answer: string;
}

// Simple heuristic to create Q&A from sentences
function generateFlashcardFromSentence(sentence: string): Flashcard | null {
  const keywords = [" is ", " are ", " refers to ", " means ", " called ", " includes "];
  for (const keyword of keywords) {
    if (sentence.toLowerCase().includes(keyword.trim())) {
      const parts = sentence.split(new RegExp(keyword, "i"));
      if (parts.length >= 2) {
        const question = sentence.replace(parts[1], "_____").trim();
        const answer = parts[1].trim().replace(/\.$/, "");
        return { question, answer };
      }
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Upload request received");

    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    // ✅ Safer validation
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    if (!file.name.toLowerCase().endsWith(".pdf")) return NextResponse.json({ error: "Only PDF files allowed" }, { status: 400 });

    console.log("📄 Processing:", file.name);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🧠 Extract text from PDF
    const data = await pdfParse(buffer);
    const text: string = data.text || "";

    console.log("✅ Extracted text length:", text.length);

    // 📁 Save to /data folder in project root
    const documentId = uuidv4();
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, `${documentId}.json`);

    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({ text }));

    console.log("💾 Saved to:", filePath);

    /* ---------------------------------- */
    /* 🤖 AUTO GENERATE NOTES AFTER UPLOAD */
    /* ---------------------------------- */
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/generate-notes`, {
      method: "POST",
    });

    /* ---------------------------------- */
    /* 🃏 AUTO GENERATE FLASHCARDS (max 6) */
    /* ---------------------------------- */
    const flashcardDir = path.join(dataDir, "flashcards");
    await fs.mkdir(flashcardDir, { recursive: true });

    const sentences = text
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const maxFlashcards = 6;
    const flashcards: Flashcard[] = [];

    for (const sentence of sentences) {
      if (flashcards.length >= maxFlashcards) break;
      const fc = generateFlashcardFromSentence(sentence);
      if (fc) flashcards.push(fc);
    }

    // Save each flashcard individually
    for (let i = 0; i < flashcards.length; i++) {
      const fcPath = path.join(flashcardDir, `${documentId}-${i}.json`);
      await fs.writeFile(fcPath, JSON.stringify(flashcards[i]));
    }

    return NextResponse.json({ success: true, documentId, flashcardsCreated: flashcards.length });

  } catch (error) {
    console.error("❌ UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Server failed to process PDF" }, { status: 500 });
  }
}
