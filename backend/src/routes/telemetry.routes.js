const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/telemetry.controller');
const auth = require('../middleware/auth.middleware');

// Receiving telemetry (unauthenticated allowed for now)
router.post('/:deviceId', ctrl.post);
router.get('/:deviceId/history', auth.adminOrOwner, ctrl.history);

module.exports = router;