export const runtime = "nodejs";

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

export async function GET(req: Request) {
  try {
    const text = "Hello! This is Learnisle podcast voice test.";

    const audioStream = await elevenlabs.textToSpeech.convert(
      "nzFihrBIvB34imQBuxub", // voiceId FIRST (string)
      {
        modelId: "eleven_multilingual_v2",
        text: text,
      }
    );

    return new Response(audioStream, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    console.error("PODCAST ERROR:", err);
    return Response.json({ error: "Failed to generate podcast" }, { status: 500 });
  }
}
