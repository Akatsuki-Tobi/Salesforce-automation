import * as dotenv from "dotenv";
import { EngineLoop } from "./src/engine-loop.js";
dotenv.config();
async function main() {
    console.log("Engine started");
    const loop = new EngineLoop();
    await loop.start("Establish initial browser observation and plan a next action.");
}
main().catch((error) => {
    console.error("Engine fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map