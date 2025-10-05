// backend/src/routes/devices.routes.js
const express = require('express');
const router = express.Router();
const devicesCtrl = require('../controllers/devices.controller');
const auth = require('../middleware/auth.middleware'); // usa o teu middleware existente

// Rota protegida — apenas admin
router.get('/', auth.adminOnly, devicesCtrl.listDevices);

// Detalhe de um device — admin ou device (se implementares)
router.get('/:deviceId', auth.adminOnly, devicesCtrl.getDevice);

// Rota pública de debug (opcional) — remover depois de testar
router.get('/public', devicesCtrl.listDevices);

module.exports = router;
