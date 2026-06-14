import { LangGraphEngine } from './langGraphEngine';
import { ExecutionLayer } from './executionLayer';
import { MemorySystem } from './memorySystem';
import { VerificationSystem } from './verificationSystem';
import { RecoverySystem } from './recoverySystem';
declare class AgentBrain {
    private langGraphEngine;
    private executionLayer;
    private memory;
    private verification;
    private recovery;
    constructor(langGraphEngine: LangGraphEngine, executionLayer: ExecutionLayer, memory: MemorySystem, verification: VerificationSystem, recovery: RecoverySystem);
    run(): Promise<void>;
}
export default AgentBrain;
//# sourceMappingURL=agentBrain.d.ts.map