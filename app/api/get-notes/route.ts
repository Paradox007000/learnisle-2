export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const notesPath = path.join(
      process.cwd(),
      "data",
      "latest-notes.txt"
    );

    const notes = await fs.readFile(notesPath, "utf-8");

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("GET NOTES ERROR:", error);

    return NextResponse.json(
      { notes: null },
      { status: 404 }
    );
  }
}
