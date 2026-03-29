"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_1 = require("./config/db");
const app_1 = require("./app");
const envPort = Number(process.env.PORT);
const PORT = Number.isFinite(envPort) && envPort > 0 ? (envPort === 5000 ? 5050 : envPort) : 5050;
const MONGODB_URI = process.env.MONGODB_URI ?? '';
async function start() {
    const mongoConnected = await (0, db_1.connectToMongo)(MONGODB_URI);
    if (!mongoConnected) {
        console.warn('MongoDB is not connected. Session persistence may be unavailable.');
    }
    const app = (0, app_1.createApp)();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`FinPath AI server listening on port ${PORT}`);
    });
}
void start();
