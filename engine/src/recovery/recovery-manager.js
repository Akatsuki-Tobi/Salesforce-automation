"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryStrategy = void 0;
exports.chooseRecoveryStrategy = chooseRecoveryStrategy;
const logger_js_1 = require("../utils/logger.js");
var RecoveryStrategy;
(function (RecoveryStrategy) {
    RecoveryStrategy["RETRY"] = "RETRY";
    RecoveryStrategy["REFRESH"] = "REFRESH";
    RecoveryStrategy["REOBSERVE"] = "REOBSERVE";
    RecoveryStrategy["ALTERNATIVE_SELECTOR"] = "ALTERNATIVE_SELECTOR";
    RecoveryStrategy["GO_BACK"] = "GO_BACK";
    RecoveryStrategy["SWITCH_TAB"] = "SWITCH_TAB";
    RecoveryStrategy["RESTART_SKILL"] = "RESTART_SKILL";
})(RecoveryStrategy || (exports.RecoveryStrategy = RecoveryStrategy = {}));
function chooseRecoveryStrategy(failureCount) {
    if (failureCount === 0) {
        return RecoveryStrategy.RETRY;
    }
    if (failureCount === 1) {
        return RecoveryStrategy.REFRESH;
    }
    if (failureCount === 2) {
        return RecoveryStrategy.REOBSERVE;
    }
    (0, logger_js_1.recoveryLog)({ strategy: RecoveryStrategy.RESTART_SKILL, failureCount });
    return RecoveryStrategy.RESTART_SKILL;
}
