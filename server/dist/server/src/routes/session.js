"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Session_1 = require("../models/Session");
const router = (0, express_1.Router)();
router.get('/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
        return res.status(400).json({ message: 'sessionId is required' });
    }
    const session = await Session_1.SessionModel.findOne({ sessionId }).lean();
    if (!session) {
        return res.status(404).json({ message: 'Session not found' });
    }
    return res.json({
        sessionId: session.sessionId,
        messages: session.messages ?? [],
        profile: session.profile,
        score: session.score,
        recommendations: session.recommendations ?? [],
        createdAt: session.createdAt instanceof Date ? session.createdAt.toISOString() : String(session.createdAt),
        updatedAt: session.updatedAt instanceof Date ? session.updatedAt.toISOString() : String(session.updatedAt),
    });
});
exports.default = router;
