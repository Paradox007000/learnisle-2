export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "data");
    const files = await fs.readdir(dir);

    if (!files.length) {
      return NextResponse.json({ error: "No documents found" }, { status: 404 });
    }

    // Get most recently modified file
    const sorted = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        return { file, time: stats.mtime.getTime() };
      })
    );

    sorted.sort((a, b) => b.time - a.time);

    const latestFile = sorted[0].file.replace(".json", "");
    const content = JSON.parse(
      await fs.readFile(path.join(dir, sorted[0].file), "utf-8")
    );

    return NextResponse.json({
      documentId: latestFile,
      text: content.text,
    });
  } catch (err) {
    console.error("LATEST DOC ERROR:", err);
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 });
  }
}
