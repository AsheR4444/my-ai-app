import { globalStore } from "@/lib/global-store";
import { VectorStore } from "@/lib/vector-store";
import { PDFProcessor } from "@/lib/pdf-processor";
import { streamText } from "ai";
import { openrouter, MODEL_NAME } from "@/lib/openrouter";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const PDF_FOLDER = path.join(process.cwd(), "pdf");

export async function POST(req: NextRequest) {
  try {
    const { message, k = 3 } = await req.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    let vectorStore = globalStore.getVectorStore();

    // Если векторное хранилище не инициализировано, создаем и индексируем заново
    if (!globalStore.isInitialized()) {
      console.log("Vector store not found, re-initializing...");

      try {
        // Создаем новое векторное хранилище
        vectorStore = new VectorStore();
        const initialized = await vectorStore.initialize();

        if (!initialized) {
          return NextResponse.json(
            { success: false, error: "Failed to initialize vector store" },
            { status: 500 }
          );
        }

        // Индексируем PDF файлы
        const pdfProcessor = new PDFProcessor();
        const chunks = await pdfProcessor.processAllPDFs(PDF_FOLDER);

        if (chunks.length === 0) {
          return NextResponse.json(
            { success: false, error: "No PDF files found to index" },
            { status: 400 }
          );
        }

        await vectorStore.addDocuments(chunks);
        globalStore.setVectorStore(vectorStore);

        console.log(`Auto-indexed ${chunks.length} chunks for RAG`);
      } catch (error) {
        console.error("Auto-indexing failed:", error);
        return NextResponse.json(
          {
            success: false,
            error:
              "Failed to auto-initialize. Please run /api/index-pdfs manually",
          },
          { status: 500 }
        );
      }
    }

    // Поиск релевантных документов
    const relevantDocs = await vectorStore.similaritySearch(
      message,
      parseInt(k)
    );

    if (relevantDocs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No relevant documents found for your query",
        },
        { status: 404 }
      );
    }

    // Формируем контекст из найденных документов
    const context = relevantDocs
      .map((doc, index) => `[${index + 1}] ${doc.pageContent}`)
      .join("\n\n");

    // Создаем промпт для LLM
    const prompt = `You are an AI assistant for Doto company documentation. You help employees and clients understand Doto's policies, procedures, and services based on the company's official documents.

Context from Doto company documents:
${context}

User Question: ${message}

Please provide a helpful and accurate answer based on Doto's documentation above. If the documentation doesn't contain enough information to answer the question, say so clearly and suggest contacting Doto support for more details.

Отвечай всегда на русском языке.`;

    // Генерируем ответ с помощью LLM
    const result = streamText({
      model: openrouter(MODEL_NAME),
      prompt: prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("RAG Chat error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
