export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// 👇 IMPORTANT — dynamic require for compatibility
const pdfParse = require("pdf-parse");

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Upload request received");

    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    // ✅ Safer validation
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 }
      );
    }

    console.log("📄 Processing:", file.name);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🧠 Extract text from PDF
    const data = await pdfParse(buffer);
    const text = data.text;

    console.log("✅ Extracted text length:", text.length);

    // 📁 Save to /data folder in project root
    const documentId = uuidv4();
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, `${documentId}.json`); // ✅ FIXED

    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({ text }));

    console.log("💾 Saved to:", filePath);
    /* ---------------------------------- */
/* 🤖 AUTO GENERATE NOTES AFTER UPLOAD */
/* ---------------------------------- */

await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/generate-notes`, {
  method: "POST",
});


    return NextResponse.json({ success: true, documentId });

  } catch (error) {
    console.error("❌ UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Server failed to process PDF" },
      { status: 500 }
    );
  }
}
