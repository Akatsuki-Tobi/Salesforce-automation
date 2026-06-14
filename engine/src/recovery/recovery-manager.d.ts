export declare enum RecoveryStrategy {
    RETRY = "RETRY",
    REFRESH = "REFRESH",
    REOBSERVE = "REOBSERVE",
    ALTERNATIVE_SELECTOR = "ALTERNATIVE_SELECTOR",
    GO_BACK = "GO_BACK",
    SWITCH_TAB = "SWITCH_TAB",
    RESTART_SKILL = "RESTART_SKILL"
}
export declare function chooseRecoveryStrategy(failureCount: number): RecoveryStrategy;
//# sourceMappingURL=recovery-manager.d.ts.map