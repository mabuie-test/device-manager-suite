// Backend/src/routes/recordings.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recordings.controller');
const auth = require('../middleware/auth.middleware');

// GET /api/recordings/:deviceId  (admin or owner)
router.get('/:deviceId', auth.adminOrOwner, ctrl.listByDevice);

module.exports = router;
