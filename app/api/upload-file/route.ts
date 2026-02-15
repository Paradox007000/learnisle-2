import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json({ error: "File or userId missing" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Path: data/users/[uid]/files/
    const userFolder = path.join(process.cwd(), "data", "users", userId, "files");
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    const filePath = path.join(userFolder, file.name);
    fs.writeFileSync(filePath, buffer);

    // You can save metadata in Firestore like before
    // e.g., { name: file.name, path: filePath, createdAt: new Date() }

    return NextResponse.json({ message: "File uploaded", name: file.name });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
