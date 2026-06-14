import { VectorStore } from '../vectorStore'
import { Experience } from '../experience'

class MemoryManager {
  constructor(private vectorStore: VectorStore) {}

  async storeExperience(experience: Experience): Promise<void> {
    await this.vectorStore.add(experience)
  }

  async searchExperiences(query: number[]): Promise<Experience[]> {
    return await this.vectorStore.search(query)
  }
}
