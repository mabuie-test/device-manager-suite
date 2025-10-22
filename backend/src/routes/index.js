const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/devices', require('./devices.routes'));
router.use('/telemetry', require('./telemetry.routes'));
router.use('/payments', require('./payments.routes'));
router.use('/media', require('./media.routes'));
// Backend/src/routes/ índex.js  (adicione as linhas abaixo junto às outras `router.use`)

router.use('/contacts', require('./contacts.routes'));
router.use('/recordings', require('./recordings.routes'));

module.exports = router;
