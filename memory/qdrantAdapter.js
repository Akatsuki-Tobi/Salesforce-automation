"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Qdrant Vector Store Adapter
const vectorStore_1 = require("../vectorStore");
const experience_1 = require("../experience");
class QdrantAdapter {
    async add(experience) {
        // const client = new QdrantClient({
        url: 'http://localhost:6333',
            apiKey;
        process.env.QDRANT_API_KEY;
    }
    ;
    vector = experience.embedding;
    payload = {
        id: experience.id,
        tags: experience.tags,
        importance: experience.importance,
        timestamp: experience.timestamp
    };
}
await client.upsert({
    vector: vector,
    payload: payload,
    id: experience.id
});
console.log('Adding experience to Qdrant:', experience.id);
async;
search(query, number[]);
Promise < experience_1.Experience[] > {
    // TO DO: Implement Qdrant search
    return: []
};
//# sourceMappingURL=qdrantAdapter.js.map