"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockingCondition = void 0;
var BlockingCondition;
(function (BlockingCondition) {
    BlockingCondition[BlockingCondition["CAPTCHA"] = 0] = "CAPTCHA";
    BlockingCondition[BlockingCondition["MFA"] = 1] = "MFA";
    BlockingCondition[BlockingCondition["ACCOUNT_SELECTION"] = 2] = "ACCOUNT_SELECTION";
    BlockingCondition[BlockingCondition["SECURITY_CONFIRMATION"] = 3] = "SECURITY_CONFIRMATION";
    BlockingCondition[BlockingCondition["PERMISSION_DIALOG"] = 4] = "PERMISSION_DIALOG";
})(BlockingCondition || (exports.BlockingCondition = BlockingCondition = {}));
//# sourceMappingURL=blockingConditions.js.map