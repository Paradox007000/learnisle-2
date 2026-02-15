import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface Flashcard {
  question: string;
  answer: string;
}

export async function GET() {
  try {
    const flashcardDir = path.join(process.cwd(), "data/flashcards");

    try {
      await fs.access(flashcardDir);
    } catch {
      return NextResponse.json([]); // no flashcards yet
    }

    const files = await fs.readdir(flashcardDir);
    const flashcards: Flashcard[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const content = await fs.readFile(path.join(flashcardDir, file), "utf-8");
        try {
          const json = JSON.parse(content);
          if (json.question && json.answer) flashcards.push(json);
        } catch {}
      }
    }

    // Return only latest 6 flashcards
    const latestFlashcards = flashcards.slice(-6).reverse();

    return NextResponse.json(latestFlashcards);
  } catch (err) {
    console.error("Error fetching flashcards:", err);
    return NextResponse.json({ error: "Failed to fetch flashcards" }, { status: 500 });
  }
}





