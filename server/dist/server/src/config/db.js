"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = connectToMongo;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToMongo(mongoUri) {
    if (!mongoUri) {
        throw new Error('MONGODB_URI is required');
    }
    await mongoose_1.default.connect(mongoUri);
}
