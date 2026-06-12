import fs from "fs";
import path from "path";
const logsDir = path.resolve(process.cwd(), "logs");
function ensureLogsDir() {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
}
export function logToFile(filename, entry) {
    ensureLogsDir();
    const filePath = path.join(logsDir, filename);
    const line = JSON.stringify({ timestamp: new Date().toISOString(), ...entry });
    fs.appendFileSync(filePath, `${line}\n`, "utf-8");
}
export function plannerLog(entry) {
    logToFile("planner.log", entry);
}
export function actionsLog(entry) {
    logToFile("actions.log", entry);
}
export function verificationLog(entry) {
    logToFile("verification.log", entry);
}
export function recoveryLog(entry) {
    logToFile("recovery.log", entry);
}
export function errorLog(entry) {
    logToFile("errors.log", entry);
}
//# sourceMappingURL=logger.js.map