"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vectorStore_1 = require("../vectorStore");
const experience_1 = require("../experience");
class MemoryManager {
    vectorStore;
    constructor(vectorStore) {
        this.vectorStore = vectorStore;
    }
    async storeExperience(experience) {
        await this.vectorStore.add(experience);
    }
    async searchExperiences(query) {
        return await this.vectorStore.search(query);
    }
}
//# sourceMappingURL=memoryManager.js.map