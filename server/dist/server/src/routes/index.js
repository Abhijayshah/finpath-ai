"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_1 = __importDefault(require("./chat"));
const profile_1 = __importDefault(require("./profile"));
const score_1 = __importDefault(require("./score"));
const session_1 = __importDefault(require("./session"));
const router = (0, express_1.Router)();
router.use('/chat', chat_1.default);
router.use('/profile', profile_1.default);
router.use('/score', score_1.default);
router.use('/session', session_1.default);
exports.default = router;
