"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = void 0;
class TaskQueue {
    tasks;
    constructor() {
        this.tasks = [];
    }
    addTask(task) {
        this.tasks.push(task);
    }
    getTasks() {
        return this.tasks;
    }
}
exports.TaskQueue = TaskQueue;
//# sourceMappingURL=taskQueue.js.map