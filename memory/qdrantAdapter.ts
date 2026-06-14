// Qdrant Vector Store Adapter
import { VectorStore } from '../vectorStore'
import { Experience } from '../experience'

class QdrantAdapter implements VectorStore {
  async add(experience: Experience): Promise<void> {
    // const client = new QdrantClient({
  url: 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY
});

const vector = experience.embedding;
const payload = {
  id: experience.id,
  tags: experience.tags,
  importance: experience.importance,
  timestamp: experience.timestamp
};

await client.upsert({
  vector: vector,
  payload: payload,
  id: experience.id
});
    console.log('Adding experience to Qdrant:', experience.id)
  }

  async search(query: number[]): Promise<Experience[]> {
    // TO DO: Implement Qdrant search
    return []
  }
}
