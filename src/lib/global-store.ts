import { VectorStore } from './vector-store';

// Глобальное хранилище для векторной базы
class GlobalStoreManager {
  private static instance: GlobalStoreManager;
  private vectorStore: VectorStore | null = null;

  private constructor() {}

  public static getInstance(): GlobalStoreManager {
    if (!GlobalStoreManager.instance) {
      GlobalStoreManager.instance = new GlobalStoreManager();
    }
    return GlobalStoreManager.instance;
  }

  public setVectorStore(store: VectorStore): void {
    this.vectorStore = store;
    console.log('Vector store set globally');
  }

  public getVectorStore(): VectorStore | null {
    return this.vectorStore;
  }

  public isInitialized(): boolean {
    return this.vectorStore !== null;
  }
}

export const globalStore = GlobalStoreManager.getInstance();