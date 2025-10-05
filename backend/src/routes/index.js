const express = require('express');
const router = express.Router();

// Rotas principais já existentes
router.use('/auth', require('./auth.routes'));
router.use('/pair', require('./pair.routes'));
router.use('/telemetry', require('./telemetry.routes'));
router.use('/media', require('./media.routes'));
router.use('/license', require('./license.routes'));

// 🔹 Nova rota dos dispositivos
router.use('/devices', require('./devices.routes'));

module.exports = router;
