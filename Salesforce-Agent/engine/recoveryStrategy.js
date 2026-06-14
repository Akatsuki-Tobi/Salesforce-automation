"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryStrategy = void 0;
var RecoveryStrategy;
(function (RecoveryStrategy) {
    RecoveryStrategy[RecoveryStrategy["RETRY"] = 0] = "RETRY";
    RecoveryStrategy[RecoveryStrategy["REOBSERVE"] = 1] = "REOBSERVE";
    RecoveryStrategy[RecoveryStrategy["REFRESH"] = 2] = "REFRESH";
    RecoveryStrategy[RecoveryStrategy["ALTERNATIVE_SELECTOR"] = 3] = "ALTERNATIVE_SELECTOR";
    RecoveryStrategy[RecoveryStrategy["GO_BACK"] = 4] = "GO_BACK";
    RecoveryStrategy[RecoveryStrategy["SWITCH_TAB"] = 5] = "SWITCH_TAB";
    RecoveryStrategy[RecoveryStrategy["REPLAN"] = 6] = "REPLAN";
})(RecoveryStrategy || (exports.RecoveryStrategy = RecoveryStrategy = {}));
//# sourceMappingURL=recoveryStrategy.js.map