import fs from "fs";
import path from "path";

const logsDir = path.resolve(process.cwd(), "logs");

function ensureLogsDir(): void {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

export function logToFile(filename: string, entry: Record<string, unknown>): void {
  ensureLogsDir();
  const filePath = path.join(logsDir, filename);
  const line = JSON.stringify({ timestamp: new Date().toISOString(), ...entry });
  fs.appendFileSync(filePath, `${line}\n`, "utf-8");
}

export function plannerLog(entry: Record<string, unknown>): void {
  logToFile("planner.log", entry);
}

export function actionsLog(entry: Record<string, unknown>): void {
  logToFile("actions.log", entry);
}

export function verificationLog(entry: Record<string, unknown>): void {
  logToFile("verification.log", entry);
}

export function recoveryLog(entry: Record<string, unknown>): void {
  logToFile("recovery.log", entry);
}

export function errorLog(entry: Record<string, unknown>): void {
  logToFile("errors.log", entry);
}
