import { VectorStore } from '@/lib/vector-store';
import { NextRequest, NextResponse } from 'next/server';

// Глобальный экземпляр для сохранения векторов между запросами
let globalVectorStore: VectorStore | null = null;

export async function POST(req: NextRequest) {
  try {
    const { query, k = 5 } = await req.json();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    // Если глобального хранилища нет, создаем новое
    if (!globalVectorStore) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Vector store not initialized. Please run /api/index-pdfs first' 
        },
        { status: 400 }
      );
    }

    const results = await globalVectorStore.similaritySearch(query, parseInt(k));

    return NextResponse.json({
      success: true,
      query,
      results: results.map(doc => ({
        content: doc.pageContent,
        metadata: doc.metadata,
        relevanceScore: doc.metadata.score || 'N/A'
      })),
      totalResults: results.length
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Экспортируем функцию для установки глобального хранилища
export function setGlobalVectorStore(vectorStore: VectorStore) {
  globalVectorStore = vectorStore;
}