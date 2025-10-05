const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/pair', require('./pair.routes'));
router.use('/telemetry', require('./telemetry.routes'));
router.use('/media', require('./media.routes'));
router.use('/license', require('./license.routes'));

module.exports = router;
