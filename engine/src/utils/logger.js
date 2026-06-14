"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logToFile = logToFile;
exports.plannerLog = plannerLog;
exports.actionsLog = actionsLog;
exports.verificationLog = verificationLog;
exports.recoveryLog = recoveryLog;
exports.errorLog = errorLog;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logsDir = path_1.default.resolve(process.cwd(), "logs");
function ensureLogsDir() {
    if (!fs_1.default.existsSync(logsDir)) {
        fs_1.default.mkdirSync(logsDir, { recursive: true });
    }
}
function logToFile(filename, entry) {
    ensureLogsDir();
    const filePath = path_1.default.join(logsDir, filename);
    const line = JSON.stringify({ timestamp: new Date().toISOString(), ...entry });
    fs_1.default.appendFileSync(filePath, `${line}\n`, "utf-8");
}
function plannerLog(entry) {
    logToFile("planner.log", entry);
}
function actionsLog(entry) {
    logToFile("actions.log", entry);
}
function verificationLog(entry) {
    logToFile("verification.log", entry);
}
function recoveryLog(entry) {
    logToFile("recovery.log", entry);
}
function errorLog(entry) {
    logToFile("errors.log", entry);
}
