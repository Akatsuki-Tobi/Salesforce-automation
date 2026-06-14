"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const langGraphEngine_1 = require("./langGraphEngine");
const executionLayer_1 = require("./executionLayer");
const memorySystem_1 = require("./memorySystem");
const verificationSystem_1 = require("./verificationSystem");
const recoverySystem_1 = require("./recoverySystem");
class AgentBrain {
    langGraphEngine;
    executionLayer;
    memory;
    verification;
    recovery;
    constructor(langGraphEngine, executionLayer, memory, verification, recovery) {
        this.langGraphEngine = langGraphEngine;
        this.executionLayer = executionLayer;
        this.memory = memory;
        this.verification = verification;
        this.recovery = recovery;
    }
    async run() {
        try {
            let observation;
            while (true) {
                try {
                    observation = await this.executionLayer.observe();
                    this.memory.storeObservation(observation);
                }
                catch (obsError) {
                    console.error('Observation failed:', obsError);
                    await this.recovery.handleObservationFailure(obsError);
                    continue;
                }
                try {
                    const plan = await this.langGraphEngine.generatePlan(observation);
                    this.memory.storePlan(plan);
                }
                catch (planError) {
                    console.error('Planning failed:', planError);
                    await this.recovery.handlePlanningFailure(planError);
                    continue;
                }
                let result;
                try {
                    result = await this.executionLayer.act(plan);
                    this.memory.storeActionResult(result);
                }
                catch (actError) {
                    console.error('Action execution failed:', actError);
                    await this.recovery.handleActionFailure(actError);
                    continue;
                }
                try {
                    const isValid = await this.verification.verifyAction(plan.lastAction, result);
                    if (!isValid) {
                        throw new Error('Verification failed');
                    }
                    this.memory.storeVerificationResult(isValid);
                }
                catch (verifyError) {
                    console.error('Verification failed:', verifyError);
                    await this.recovery.handleVerificationFailure(verifyError);
                    continue;
                }
                try {
                    await this.memory.reflectOnExperience(observation, plan, result, isValid);
                }
                catch (reflectError) {
                    console.error('Reflection failed:', reflectError);
                }
            }
        }
        catch (fatalError) {
            console.error('Critical failure in agent loop:', fatalError);
            await this.recovery.handleFatalError(fatalError);
        }
    }
}
exports.default = AgentBrain;
//# sourceMappingURL=agentBrain.js.map