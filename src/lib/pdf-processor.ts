import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import fs from 'fs';
import path from 'path';

export interface PDFChunk {
  content: string;
  metadata: {
    source: string;
    page?: number;
    chunkIndex: number;
  };
}

export class PDFProcessor {
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }

  async processPDF(filePath: string): Promise<PDFChunk[]> {
    try {
      // Load PDF using LangChain
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();
      
      const fileName = path.basename(filePath);
      const allChunks: PDFChunk[] = [];
      
      // Process each document (page)
      for (const doc of docs) {
        const chunks = await this.textSplitter.splitText(doc.pageContent);
        
        // Create chunk objects with metadata
        const pdfChunks: PDFChunk[] = chunks.map((chunk, index) => ({
          content: chunk.trim(),
          metadata: {
            source: fileName,
            page: doc.metadata.page || undefined,
            chunkIndex: allChunks.length + index,
          }
        }));
        
        allChunks.push(...pdfChunks);
      }

      return allChunks;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processAllPDFs(folderPath: string): Promise<PDFChunk[]> {
    try {
      const files = fs.readdirSync(folderPath);
      const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
      
      if (pdfFiles.length === 0) {
        throw new Error('No PDF files found in the folder');
      }

      const allChunks: PDFChunk[] = [];
      
      for (const file of pdfFiles) {
        const filePath = path.join(folderPath, file);
        const chunks = await this.processPDF(filePath);
        allChunks.push(...chunks);
      }

      return allChunks;
    } catch (error) {
      console.error('Error processing PDFs folder:', error);
      throw error;
    }
  }
}