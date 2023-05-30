"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.signJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signJwtToken = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, String(process.env.JWT_SECRET), { expiresIn: process.env.JWT_EXPIRESIN });
    return accessToken;
};
exports.signJwtToken = signJwtToken;
const verifyJwtToken = (accessToken) => {
    const decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, String(process.env.JWT_SECRET));
    return decodedAccessToken;
};
exports.verifyJwtToken = verifyJwtToken;
