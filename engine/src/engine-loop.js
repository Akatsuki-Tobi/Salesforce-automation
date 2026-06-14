"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineLoop = void 0;
const planner_js_1 = require("./planner/planner.js");
const playwright_executor_js_1 = require("./execution/playwright-executor.js");
const action_validator_js_1 = require("./validation/action-validator.js");
const verification_engine_js_1 = require("./verification/verification-engine.js");
const recovery_manager_js_1 = require("./recovery/recovery-manager.js");
const page_observer_js_1 = require("./observation/page-observer.js");
const state_manager_js_1 = require("./world-model/state-manager.js");
const logger_js_1 = require("./utils/logger.js");
const agent_js_1 = require("./types/agent.js");
const gap_detector_js_1 = require("./rag/gap-detector.js");
const service_js_1 = require("./rag/service.js");
const MAX_STEPS_PER_GOAL = 15;
const MAX_TOTAL_STEPS = 200;
class EngineLoop {
    constructor() {
        this.planner = new planner_js_1.Planner();
        this.executor = new playwright_executor_js_1.PlaywrightExecutor();
        this.gapDetector = new gap_detector_js_1.GapDetector();
        this.ragService = new service_js_1.RAGService();
        this.failureCount = 0;
        this.stepCount = 0;
    }
    async start(goal) {
        (0, state_manager_js_1.updateGoal)(goal);
        (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.OBSERVE, stepCount: 0 });
        await this.executor.launch();
        await this.observe();
        while (this.stepCount < MAX_TOTAL_STEPS) {
            const worldModel = (0, state_manager_js_1.getWorldModel)();
            if (worldModel.environment.blocked) {
                console.log("Agent blocked; waiting for human intervention.");
                break;
            }
            if (this.stepCount >= MAX_STEPS_PER_GOAL) {
                console.log("Reached max steps for goal.");
                break;
            }
            (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.PLAN, stepCount: this.stepCount });
            (0, logger_js_1.plannerLog)({ event: "plan_start", step: this.stepCount, goal });
            const plan = await this.planner.planNextStep(worldModel);
            (0, logger_js_1.plannerLog)({ event: "plan_result", plan });
            (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.VALIDATE });
            const validation = await (0, action_validator_js_1.validatePlannedAction)(plan, this.executor.page);
            if (!validation.approved) {
                (0, logger_js_1.plannerLog)({ event: "plan_rejected", reason: validation.reason });
                (0, state_manager_js_1.addDiscoveredFact)(`Rejected action: ${validation.reason}`);
                this.failureCount += 1;
                if (this.failureCount >= 3) {
                    const strategy = (0, recovery_manager_js_1.chooseRecoveryStrategy)(this.failureCount);
                    (0, logger_js_1.recoveryLog)({ strategy, failureCount: this.failureCount });
                    break;
                }
                await this.recover();
                continue;
            }
            (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.EXECUTE });
            await this.executor.executeAction(plan);
            (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.VERIFY });
            const success = await (0, verification_engine_js_1.verifyActionOutcome)(plan.expected_outcome, this.executor.page);
            if (success) {
                const actionRecord = {
                    id: `${Date.now()}-${this.stepCount}`,
                    action: plan.action,
                    params: plan.params,
                    result: "success",
                    timestamp: Date.now(),
                };
                (0, state_manager_js_1.addCompletedAction)(actionRecord);
                (0, logger_js_1.verificationLog)({ step: this.stepCount, success, action: plan.action });
                this.failureCount = 0;
            }
            else {
                const actionRecord = {
                    id: `${Date.now()}-${this.stepCount}`,
                    action: plan.action,
                    params: plan.params,
                    result: "failure",
                    timestamp: Date.now(),
                };
                (0, state_manager_js_1.addFailedAction)(actionRecord);
                (0, logger_js_1.verificationLog)({ step: this.stepCount, success, action: plan.action });
                this.failureCount += 1;
            }
            try {
                // RAG: Detect and fill knowledge gaps
                const worldModelForGap = (0, state_manager_js_1.getWorldModel)();
                const gapResult = this.gapDetector.detect(worldModelForGap, plan, success);
                if (gapResult.gap) {
                    (0, state_manager_js_1.addKnowledgeGap)(gapResult.gap);
                    const context = await this.ragService.fillKnowledgeGap(gapResult.gap.query);
                    (0, state_manager_js_1.setKnowledgeContext)(context);
                    // Resolve the gap after retrieval
                    (0, state_manager_js_1.resolveKnowledgeGap)(gapResult.gap.query);
                    (0, state_manager_js_1.addDiscoveredFact)(`RAG: filled knowledge gap with ${context.chunks.length} chunks`);
                }
            }
            catch (ragError) {
                console.error("RAG processing error:", ragError);
                (0, state_manager_js_1.addDiscoveredFact)(`RAG error: ${ragError instanceof Error ? ragError.message : String(ragError)}`);
            }
            (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.REFLECT });
            (0, state_manager_js_1.addDiscoveredFact)(`Step ${this.stepCount} executed: ${plan.action} success=${success}`);
            if (plan.is_complete && success) {
                (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.COMPLETE });
                break;
            }
            if (!success) {
                await this.recover();
            }
            this.stepCount += 1;
            await this.observe();
        }
        await this.executor.close();
        (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.FAILED });
    }
    async observe() {
        (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.OBSERVE });
        if (!this.executor.page) {
            throw new Error("No Playwright page available for observation.");
        }
        const observation = await (0, page_observer_js_1.observePage)(this.executor.page);
        (0, state_manager_js_1.addObservation)(observation);
        (0, state_manager_js_1.updateBrowserState)({ currentUrl: observation.url, pageTitle: observation.title });
        (0, state_manager_js_1.updateEnvironment)({ authenticated: true });
    }
    async recover() {
        (0, state_manager_js_1.updateStatus)({ state: agent_js_1.AgentState.RECOVER });
        const strategy = (0, recovery_manager_js_1.chooseRecoveryStrategy)(this.failureCount);
        (0, logger_js_1.recoveryLog)({ event: "recover_start", strategy, failureCount: this.failureCount });
        if (!this.executor.page)
            return;
        switch (strategy) {
            case "REFRESH":
                await this.executor.page.reload({ waitUntil: "domcontentloaded" });
                break;
            case "REOBSERVE":
                await this.observe();
                break;
            default:
                try {
                    await this.executor.page.reload({ waitUntil: "domcontentloaded" });
                }
                catch {
                    // ignore
                }
                break;
        }
        (0, logger_js_1.recoveryLog)({ event: "recover_complete", strategy });
    }
}
exports.EngineLoop = EngineLoop;
