"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || config_1.config.JWT_SECRET;
    return jsonwebtoken_1.default.sign({ userId }, secret);
};
exports.generateToken = generateToken;
const generateRefreshToken = (userId) => {
    const secret = process.env.JWT_REFRESH_SECRET || config_1.config.JWT_REFRESH_SECRET;
    return jsonwebtoken_1.default.sign({ userId }, secret);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || config_1.config.JWT_SECRET;
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (token) => {
    const secret = process.env.JWT_REFRESH_SECRET || config_1.config.JWT_REFRESH_SECRET;
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map