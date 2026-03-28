"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        // if (envVars.NODE_ENV === "development") {
        //     console.log(error);
        // }
        next(error);
    });
};
exports.catchAsync = catchAsync;
