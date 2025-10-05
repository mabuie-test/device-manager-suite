const express = require('express');
const router = express.Router();
const controller = require('../controllers/license.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/generate', authMiddleware.adminOnly, controller.generate);

module.exports = router;
