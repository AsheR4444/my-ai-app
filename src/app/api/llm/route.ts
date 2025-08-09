import { generateText, streamText } from "ai";
import { openrouter, MODEL_NAME } from "@/lib/openrouter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    console.log(message);
    const result = streamText({
      model: openrouter(MODEL_NAME),
      system:
        "Ты всегда отвечаешь на русском языке. и СТРОГО в формате JSON. Ответь одним предложением. ",
      prompt: message,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
