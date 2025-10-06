const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/payments.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth.requireAuth, ctrl.create);
router.get('/', auth.adminOnly, ctrl.list);
router.post('/:id/process', auth.adminOnly, ctrl.process);

module.exports = router;