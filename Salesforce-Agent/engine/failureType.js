"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailureType = void 0;
var FailureType;
(function (FailureType) {
    FailureType[FailureType["ELEMENT_NOT_FOUND"] = 0] = "ELEMENT_NOT_FOUND";
    FailureType[FailureType["TIMEOUT"] = 1] = "TIMEOUT";
    FailureType[FailureType["VERIFICATION_FAILED"] = 2] = "VERIFICATION_FAILED";
    FailureType[FailureType["NETWORK_ERROR"] = 3] = "NETWORK_ERROR";
    FailureType[FailureType["NAVIGATION_ERROR"] = 4] = "NAVIGATION_ERROR";
    FailureType[FailureType["UNKNOWN"] = 5] = "UNKNOWN";
})(FailureType || (exports.FailureType = FailureType = {}));
//# sourceMappingURL=failureType.js.map