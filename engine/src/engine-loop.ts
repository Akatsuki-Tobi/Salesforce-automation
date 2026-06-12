import { Planner } from "./planner/planner.js";
import { PlaywrightExecutor } from "./execution/playwright-executor.js";
import { validatePlannedAction } from "./validation/action-validator.js";
import { verifyActionOutcome } from "./verification/verification-engine.js";
import { chooseRecoveryStrategy } from "./recovery/recovery-manager.js";
import { observePage } from "./observation/page-observer.js";
import {
  getWorldModel,
  updateGoal,
  updateStatus,
  addObservation,
  addCompletedAction,
  addFailedAction,
  addDiscoveredFact,
  updateBrowserState,
  updateEnvironment,
  setKnowledgeContext,
  addKnowledgeGap,
  resolveKnowledgeGap,
} from "./world-model/state-manager.js";
import { plannerLog, errorLog, verificationLog, recoveryLog } from "./utils/logger.js";
import type { ActionRecord } from "./types/agent.js";
import { AgentState } from "./types/agent.js";
import { GapDetector } from "./rag/gap-detector.js";
import { RAGService } from "./rag/service.js";

const MAX_STEPS_PER_GOAL = 15;
const MAX_TOTAL_STEPS = 200;

export class EngineLoop {
  private readonly planner = new Planner();
  private readonly executor = new PlaywrightExecutor();
  private readonly gapDetector = new GapDetector();
  private readonly ragService = new RAGService();
  private failureCount = 0;
  private stepCount = 0;

  async start(goal: string): Promise<void> {
    updateGoal(goal);
    updateStatus({ state: AgentState.OBSERVE, stepCount: 0 });
    await this.executor.launch();
    await this.observe();

    while (this.stepCount < MAX_TOTAL_STEPS) {
      const worldModel = getWorldModel();
      if (worldModel.environment.blocked) {
        console.log("Agent blocked; waiting for human intervention.");
        break;
      }

      if (this.stepCount >= MAX_STEPS_PER_GOAL) {
        console.log("Reached max steps for goal.");
        break;
      }

      updateStatus({ state: AgentState.PLAN, stepCount: this.stepCount });
      plannerLog({ event: "plan_start", step: this.stepCount, goal });

      const plan = await this.planner.planNextStep(worldModel);
      plannerLog({ event: "plan_result", plan });

      updateStatus({ state: AgentState.VALIDATE });
      const validation = await validatePlannedAction(plan, this.executor.page);
      if (!validation.approved) {
        plannerLog({ event: "plan_rejected", reason: validation.reason });
        addDiscoveredFact(`Rejected action: ${validation.reason}`);
        this.failureCount += 1;
        if (this.failureCount >= 3) {
          const strategy = chooseRecoveryStrategy(this.failureCount);
          recoveryLog({ strategy, failureCount: this.failureCount });
          break;
        }
        await this.recover();
        continue;
      }

      updateStatus({ state: AgentState.EXECUTE });
      await this.executor.executeAction(plan);

      updateStatus({ state: AgentState.VERIFY });
      const success = await verifyActionOutcome(plan.expected_outcome, this.executor.page);
      if (success) {
        const actionRecord: ActionRecord = {
          id: `${Date.now()}-${this.stepCount}`,
          action: plan.action,
          params: plan.params,
          result: "success",
          timestamp: Date.now(),
        };
        addCompletedAction(actionRecord);
        verificationLog({ step: this.stepCount, success, action: plan.action });
        this.failureCount = 0;
      } else {
        const actionRecord: ActionRecord = {
          id: `${Date.now()}-${this.stepCount}`,
          action: plan.action,
          params: plan.params,
          result: "failure",
          timestamp: Date.now(),
        };
        addFailedAction(actionRecord);
        verificationLog({ step: this.stepCount, success, action: plan.action });
        this.failureCount += 1;
      }

      try {
        // RAG: Detect and fill knowledge gaps
        const worldModelForGap = getWorldModel();
        const gapResult = this.gapDetector.detect(worldModelForGap, plan, success);
        if (gapResult.gap) {
          addKnowledgeGap(gapResult.gap);
          const context = await this.ragService.fillKnowledgeGap(gapResult.gap.query);
          setKnowledgeContext(context);
          // Resolve the gap after retrieval
          resolveKnowledgeGap(gapResult.gap.query);
          addDiscoveredFact(`RAG: filled knowledge gap with ${context.chunks.length} chunks`);
        }
      } catch (ragError) {
        console.error("RAG processing error:", ragError);
        addDiscoveredFact(`RAG error: ${ragError instanceof Error ? ragError.message : String(ragError)}`);
      }

      updateStatus({ state: AgentState.REFLECT });
      addDiscoveredFact(`Step ${this.stepCount} executed: ${plan.action} success=${success}`);

      if (plan.is_complete && success) {
        updateStatus({ state: AgentState.COMPLETE });
        break;
      }

      if (!success) {
        await this.recover();
      }

      this.stepCount += 1;
      await this.observe();
    }

    await this.executor.close();
    updateStatus({ state: AgentState.FAILED });
  }

  private async observe(): Promise<void> {
    updateStatus({ state: AgentState.OBSERVE });
    if (!this.executor.page) {
      throw new Error("No Playwright page available for observation.");
    }

    const observation = await observePage(this.executor.page);
    addObservation(observation);
    updateBrowserState({ currentUrl: observation.url, pageTitle: observation.title });
    updateEnvironment({ authenticated: true });
  }

  private async recover(): Promise<void> {
    updateStatus({ state: AgentState.RECOVER });
    const strategy = chooseRecoveryStrategy(this.failureCount);
    recoveryLog({ event: "recover_start", strategy, failureCount: this.failureCount });

    if (!this.executor.page) return;

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
        } catch {
          // ignore
        }
        break;
    }

    recoveryLog({ event: "recover_complete", strategy });
  }
}
