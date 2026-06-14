import { LangGraphEngine } from './langGraphEngine';
import { ExecutionLayer } from './executionLayer';
import { MemorySystem } from './memorySystem';
import { VerificationSystem } from './verificationSystem';
import { RecoverySystem } from './recoverySystem';

class AgentBrain {
  constructor(
    private langGraphEngine: LangGraphEngine,
    private executionLayer: ExecutionLayer,
    private memory: MemorySystem,
    private verification: VerificationSystem,
    private recovery: RecoverySystem
  ) {}

  async run() {
    try {
      let observation: Observation;
      while (true) {
        try {
          observation = await this.executionLayer.observe();
          this.memory.storeObservation(observation);
        } catch (obsError) {
          console.error('Observation failed:', obsError);
          await this.recovery.handleObservationFailure(obsError);
          continue;
        }

        try {
          const plan = await this.langGraphEngine.generatePlan(observation);
          this.memory.storePlan(plan);
        } catch (planError) {
          console.error('Planning failed:', planError);
          await this.recovery.handlePlanningFailure(planError);
          continue;
        }

        let result: ExecutionResult;
        try {
          result = await this.executionLayer.act(plan);
          this.memory.storeActionResult(result);
        } catch (actError) {
          console.error('Action execution failed:', actError);
          await this.recovery.handleActionFailure(actError);
          continue;
        }

        try {
          const isValid = await this.verification.verifyAction(
            plan.lastAction,
            result
          );
          if (!isValid) {
            throw new Error('Verification failed');
          }
          this.memory.storeVerificationResult(isValid);
        } catch (verifyError) {
          console.error('Verification failed:', verifyError);
          await this.recovery.handleVerificationFailure(verifyError);
          continue;
        }

        try {
          await this.memory.reflectOnExperience(
            observation,
            plan,
            result,
            isValid
          );
        } catch (reflectError) {
          console.error('Reflection failed:', reflectError);
        }
      }
    } catch (fatalError) {
      console.error('Critical failure in agent loop:', fatalError);
      await this.recovery.handleFatalError(fatalError);
    }
  }
}

export default AgentBrain;
