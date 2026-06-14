import fs from "fs";
import path from "path";
import type { Observation } from "../types/agent.js";

const observationsDir = path.resolve(process.cwd(), "observations");

export function ensureObservationsDir(): void {
  if (!fs.existsSync(observationsDir)) {
    fs.mkdirSync(observationsDir, { recursive: true });
  }
}

export function saveObservation(observation: Observation): void {
  ensureObservationsDir();
  const timestamp = observation.timestamp;
  const dir = path.join(observationsDir, `${timestamp}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(path.join(dir, "dom.json"), JSON.stringify(observation.dom, null, 2), "utf-8");
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify({
    url: observation.url,
    title: observation.title,
    timestamp: observation.timestamp,
    visibleText: observation.visibleText,
    breadcrumbs: observation.breadcrumbs,
  }, null, 2), "utf-8");
  fs.writeFileSync(path.join(dir, "accessibility.json"), JSON.stringify(observation.accessibilityTree, null, 2), "utf-8");
}
