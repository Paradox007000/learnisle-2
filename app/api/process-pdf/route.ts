export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Upload request received");

    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    console.log("📄 File:", file?.name, file?.type);

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF" }, { status: 400 });
    }

    console.log("📦 Loading pdf-parse...");
    const pdfParse = (await import("pdf-parse")).default;

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("🧠 Extracting text from PDF...");
    const pdfData = await pdfParse(buffer);

    const text = pdfData.text;
    console.log("✅ Text extracted length:", text.length);

    const documentId = uuidv4();
    const dir = path.join(process.cwd(), "data");
    const filePath = path.join(dir, `${documentId}.json`);

    console.log("💾 Saving to:", filePath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({ text }));

    console.log("🎉 File saved successfully");

    return NextResponse.json({ success: true, documentId });

  } catch (error) {
    console.error("❌ UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Server failed to process PDF" },
      { status: 500 }
    );
  }
}
