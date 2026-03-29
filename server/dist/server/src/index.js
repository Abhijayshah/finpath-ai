"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_1 = require("./config/db");
const app_1 = require("./app");
const PORT = Number(process.env.PORT ?? 5000);
const MONGODB_URI = process.env.MONGODB_URI ?? '';
async function start() {
    try {
        await (0, db_1.connectToMongo)(MONGODB_URI);
        const app = (0, app_1.createApp)();
        app.listen(PORT, () => {
            console.log(`FinPath AI server listening on port ${PORT}`);
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`Failed to start server: ${message}`);
        process.exit(1);
    }
}
void start();
