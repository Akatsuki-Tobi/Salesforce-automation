// Chroma Vector Store Adapter
import { VectorStore } from '../vectorStore'
import { Experience } from '../experience'

class ChromaAdapter implements VectorStore {
  async add(experience: Experience): Promise<void> {
    // TO DO: Implement Chroma client insertion
    console.log('Adding experience to Chroma:', experience.id)
  }

  async search(query: number[]): Promise<Experience[]> {
    // TO DO: Implement Chroma search
    return []
  }
}
