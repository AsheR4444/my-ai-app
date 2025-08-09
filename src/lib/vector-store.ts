import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { embeddings } from './embeddings';
import { PDFChunk } from './pdf-processor';
import path from 'path';

const CHROMA_PATH = path.join(process.cwd(), 'chroma-db');
const COLLECTION_NAME = 'pdf_documents';

export class VectorStore {
  private vectorStore: MemoryVectorStore | null = null;

  async initialize() {
    try {
      this.vectorStore = new MemoryVectorStore(embeddings);
      console.log('Vector store initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize vector store:', error);
      return false;
    }
  }

  async addDocuments(chunks: PDFChunk[]): Promise<void> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }

    // Convert PDF chunks to LangChain Documents
    const documents: Document[] = chunks.map((chunk) => ({
      pageContent: chunk.content,
      metadata: {
        source: chunk.metadata.source,
        page: chunk.metadata.page,
        chunkIndex: chunk.metadata.chunkIndex,
      },
    }));

    await this.vectorStore.addDocuments(documents);
    console.log(`Added ${documents.length} documents to vector store`);
  }

  async similaritySearch(query: string, k: number = 5): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }

    return await this.vectorStore.similaritySearch(query, k);
  }

  async deleteCollection(): Promise<void> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }

    try {
      await this.vectorStore.delete();
      console.log('Collection deleted successfully');
    } catch (error) {
      console.error('Failed to delete collection:', error);
      throw error;
    }
  }
}