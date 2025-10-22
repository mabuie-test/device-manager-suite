// Backend/src/routes/contacts.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contacts.controller');
const auth = require('../middleware/auth.middleware');

// GET /api/contacts/:deviceId  (admin or owner)
router.get('/:deviceId', auth.adminOrOwner, ctrl.listByDevice);

module.exports = router;
