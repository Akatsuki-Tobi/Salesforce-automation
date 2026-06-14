"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Chroma Vector Store Adapter
const vectorStore_1 = require("../vectorStore");
const experience_1 = require("../experience");
class ChromaAdapter {
    async add(experience) {
        // TO DO: Implement Chroma client insertion
        console.log('Adding experience to Chroma:', experience.id);
    }
    async search(query) {
        // TO DO: Implement Chroma search
        return [];
    }
}
//# sourceMappingURL=chromaAdapter.js.map