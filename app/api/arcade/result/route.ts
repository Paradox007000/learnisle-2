import { NextResponse } from "next/server";
import {
  processGameResult,
  DEFAULT_STATE,
  ArcadeState,
} from "@/lib/arcade/arcadeEngine";

let playerState: ArcadeState = DEFAULT_STATE;

export async function POST(req: Request) {
  try {
    const { correct } = await req.json();

    playerState = processGameResult(playerState, {
      correct,
    });

    return NextResponse.json({
      success: true,
      state: playerState,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Arcade update failed" },
      { status: 500 }
    );
  }
}
