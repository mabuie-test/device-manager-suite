// backend/src/controllers/devices.controller.js
const Device = require('../models/device.model');

exports.listDevices = async (req, res) => {
  try {
    const limit = Math.min(200, parseInt(req.query.limit || 100, 10));
    const skip = parseInt(req.query.skip || 0, 10);
    const sortField = req.query.sort || 'lastSeen';

    const q = {}; // podes adicionar filtros por query params (ex: owner)

    const total = await Device.countDocuments(q);
    const devices = await Device.find(q)
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({ ok: true, total, devices });
  } catch (err) {
    console.error('listDevices error', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
};

exports.getDevice = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    if (!deviceId) return res.status(400).json({ ok: false, error: 'missing_deviceId' });
    const device = await Device.findOne({ deviceId }).lean();
    if (!device) return res.status(404).json({ ok: false, error: 'not_found' });
    return res.json({ ok: true, device });
  } catch (err) {
    console.error('getDevice error', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
};
