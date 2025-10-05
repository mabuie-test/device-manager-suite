const express = require('express');
const router = express.Router();
const devicesCtrl = require('../controllers/devices.controller');
const auth = require('../middleware/auth');

// 🔸 Lista pública (teste)
router.get('/public', devicesCtrl.publicList);

// 🔸 Lista de dispositivos (apenas admin)
router.get('/', auth.adminOnly, devicesCtrl.getAllDevices);

// 🔸 Obter um dispositivo específico (admin ou o próprio device)
router.get('/:deviceId', auth.adminOrDevice, devicesCtrl.getDeviceById);

module.exports = router;
