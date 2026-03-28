"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const handleDuplicateError = (error) => {
    var _a;
    const matchedArray = (_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.match(/"([^"]*)"/);
    const value = (matchedArray === null || matchedArray === void 0 ? void 0 : matchedArray[1]) || "Duplicate value";
    return {
        statusCode: 400,
        message: `${value} already exists!!`
    };
};
exports.handleDuplicateError = handleDuplicateError;
