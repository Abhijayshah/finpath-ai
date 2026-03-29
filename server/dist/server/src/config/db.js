"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = connectToMongo;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('bufferCommands', false);
async function connectToMongo(mongoUri) {
    if (!mongoUri)
        return false;
    try {
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 3000,
        });
        return true;
    }
    catch {
        return false;
    }
}
