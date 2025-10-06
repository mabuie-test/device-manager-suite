const Device = require('../models/device.model');

exports.list = async (req, res) => {
  try {
    const devices = await Device.find().sort({ lastSeen: -1 }).lean();
    res.json({ ok: true, devices });
  } catch (err) {
    console.error('devices.list error', err);
    res.status(500).json({ ok:false, error:'server_error' });
  }
};

exports.get = async (req, res) => {
  try {
    const d = await Device.findOne({ deviceId: req.params.deviceId }).lean();
    if (!d) return res.status(404).json({ ok:false, error:'not_found' });
    res.json({ ok:true, device: d });
  } catch (err) {
    console.error('devices.get error', err);
    res.status(500).json({ ok:false, error:'server_error' });
  }
};