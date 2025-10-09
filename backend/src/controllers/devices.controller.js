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

/**
 * listMy - devices owned by authenticated user
 * Requires auth middleware (req.user.id available)
 */
exports.listMy = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ ok:false, error:'not_authenticated' });
    const devices = await Device.find({ owner: userId }).sort({ lastSeen: -1 }).lean();
    res.json({ ok: true, devices });
  } catch (err) {
    console.error('devices.listMy error', err);
    res.status(500).json({ ok:false, error:'server_error' });
  }
};
