"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const example_1 = __importDefault(require("../src/example"));
describe('example', () => {
    it('should return true', () => {
        expect((0, example_1.default)()).toBe(true);
    });
});
