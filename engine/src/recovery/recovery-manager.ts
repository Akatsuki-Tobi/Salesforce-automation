import { recoveryLog } from "../utils/logger.js";

export enum RecoveryStrategy {
  RETRY = "RETRY",
  REFRESH = "REFRESH",
  REOBSERVE = "REOBSERVE",
  ALTERNATIVE_SELECTOR = "ALTERNATIVE_SELECTOR",
  GO_BACK = "GO_BACK",
  SWITCH_TAB = "SWITCH_TAB",
  RESTART_SKILL = "RESTART_SKILL",
}

export function chooseRecoveryStrategy(failureCount: number): RecoveryStrategy {
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
