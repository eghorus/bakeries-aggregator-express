"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this._statusCode = statusCode;
        this._status =
            statusCode >= 200 && statusCode < 400 ? "Success" : statusCode >= 400 && statusCode < 500 ? "Fail" : "Error";
        this._message = message;
        this._isOperational = true;
    }
}
exports.default = OpError;
