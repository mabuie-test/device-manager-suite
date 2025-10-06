const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/devices.controller');
const auth = require('../middleware/auth.middleware');

router.get('/public', ctrl.list);
router.get('/:deviceId', auth.adminOrOwner, ctrl.get);

module.exports = router;