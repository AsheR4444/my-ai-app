import { PDFProcessor } from "@/lib/pdf-processor";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const PDF_FOLDER = path.join(process.cwd(), "pdf");

export async function GET(req: NextRequest) {
  try {
    const pdfProcessor = new PDFProcessor();
    const chunks = await pdfProcessor.processAllPDFs(PDF_FOLDER);

    const { showAll } = Object.fromEntries(new URL(req.url).searchParams);

    return NextResponse.json({
      success: true,
      message: `Processed ${chunks.length} chunks from PDF files`,
      chunks: showAll === "true" ? chunks : chunks.slice(0, 3),
      totalChunks: chunks.length,
    });
  } catch (error) {
    console.error("PDF processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
