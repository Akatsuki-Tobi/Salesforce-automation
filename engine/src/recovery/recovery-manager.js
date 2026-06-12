import { recoveryLog } from "../utils/logger.js";
export var RecoveryStrategy;
(function (RecoveryStrategy) {
    RecoveryStrategy["RETRY"] = "RETRY";
    RecoveryStrategy["REFRESH"] = "REFRESH";
    RecoveryStrategy["REOBSERVE"] = "REOBSERVE";
    RecoveryStrategy["ALTERNATIVE_SELECTOR"] = "ALTERNATIVE_SELECTOR";
    RecoveryStrategy["GO_BACK"] = "GO_BACK";
    RecoveryStrategy["SWITCH_TAB"] = "SWITCH_TAB";
    RecoveryStrategy["RESTART_SKILL"] = "RESTART_SKILL";
})(RecoveryStrategy || (RecoveryStrategy = {}));
export function chooseRecoveryStrategy(failureCount) {
    if (failureCount === 0) {
        return RecoveryStrategy.RETRY;
    }
    if (failureCount === 1) {
        return RecoveryStrategy.REFRESH;
    }
    if (failureCount === 2) {
        return RecoveryStrategy.REOBSERVE;
    }
    recoveryLog({ strategy: RecoveryStrategy.RESTART_SKILL, failureCount });
    return RecoveryStrategy.RESTART_SKILL;
}
//# sourceMappingURL=recovery-manager.js.map