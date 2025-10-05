const express = require('express');
const router = express.Router();
const controller = require('../controllers/telemetry.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/:deviceId', authMiddleware.deviceOnly, controller.receive);
router.get('/:deviceId/history', authMiddleware.adminOrDevice, controller.history);

module.exports = router;
