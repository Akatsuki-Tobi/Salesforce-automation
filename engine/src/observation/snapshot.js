"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureObservationsDir = ensureObservationsDir;
exports.saveObservation = saveObservation;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const observationsDir = path_1.default.resolve(process.cwd(), "observations");
function ensureObservationsDir() {
    if (!fs_1.default.existsSync(observationsDir)) {
        fs_1.default.mkdirSync(observationsDir, { recursive: true });
    }
}
function saveObservation(observation) {
    ensureObservationsDir();
    const timestamp = observation.timestamp;
    const dir = path_1.default.join(observationsDir, `${timestamp}`);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    fs_1.default.writeFileSync(path_1.default.join(dir, "dom.json"), JSON.stringify(observation.dom, null, 2), "utf-8");
    fs_1.default.writeFileSync(path_1.default.join(dir, "meta.json"), JSON.stringify({
        url: observation.url,
        title: observation.title,
        timestamp: observation.timestamp,
        visibleText: observation.visibleText,
        breadcrumbs: observation.breadcrumbs,
    }, null, 2), "utf-8");
    fs_1.default.writeFileSync(path_1.default.join(dir, "accessibility.json"), JSON.stringify(observation.accessibilityTree, null, 2), "utf-8");
}
