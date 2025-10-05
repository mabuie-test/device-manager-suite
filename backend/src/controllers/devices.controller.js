const Device = require('../models/device.model');

// 🔹 Lista todos os dispositivos (apenas admin)
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ pairedAt: -1 });
    res.json({ ok: true, devices });
  } catch (err) {
    console.error('getAllDevices error:', err);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
};

// 🔹 Obtém um dispositivo específico (admin ou o próprio device)
exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.deviceId });
    if (!device) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true, device });
  } catch (err) {
    console.error('getDeviceById error:', err);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
};

// 🔹 Endpoint público simples (para debug)
exports.publicList = async (req, res) => {
  try {
    const devices = await Device.find({}, 'deviceId name lastSeen').limit(10);
    res.json({ ok: true, count: devices.length, devices });
  } catch (err) {
    console.error('publicList error:', err);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
};
