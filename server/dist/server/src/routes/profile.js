"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let inMemoryProfile = null;
router.get('/', (_req, res) => {
    res.json({ profile: inMemoryProfile });
});
router.post('/', (req, res) => {
    const { profile } = req.body;
    if (!profile || typeof profile !== 'object') {
        return res.status(400).json({
            profile: {
                name: '',
                age: 0,
                income: 0,
                expenses: 0,
                goals: [],
                investments: [],
                riskAppetite: 'moderate',
                insurance: [],
                hasEmergencyFund: false,
            },
        });
    }
    inMemoryProfile = profile;
    return res.json({ profile });
});
exports.default = router;
