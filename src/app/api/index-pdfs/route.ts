import { PDFProcessor } from '@/lib/pdf-processor';
import { VectorStore } from '@/lib/vector-store';
import { globalStore } from '@/lib/global-store';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const PDF_FOLDER = path.join(process.cwd(), 'pdf');

export async function POST() {
  try {
    // Process PDFs
    const pdfProcessor = new PDFProcessor();
    const chunks = await pdfProcessor.processAllPDFs(PDF_FOLDER);
    
    if (chunks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No PDF chunks found' },
        { status: 400 }
      );
    }

    // Initialize vector store
    const vectorStore = new VectorStore();
    const initialized = await vectorStore.initialize();
    
    if (!initialized) {
      return NextResponse.json(
        { success: false, error: 'Failed to initialize vector store' },
        { status: 500 }
      );
    }

    // Add documents to vector store
    await vectorStore.addDocuments(chunks);

    // Сохраняем векторное хранилище глобально
    globalStore.setVectorStore(vectorStore);

    return NextResponse.json({
      success: true,
      message: `Successfully indexed ${chunks.length} chunks from PDF files`,
      totalChunks: chunks.length,
      files: [...new Set(chunks.map(chunk => chunk.metadata.source))]
    });

  } catch (error) {
    console.error('PDF indexing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}