const express = require('express');
const router = express.Router();
const controller = require('../controllers/pair.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/create', authMiddleware.adminOnly, controller.createPairCode);
router.post('/confirm', controller.confirmPair);

module.exports = router;
