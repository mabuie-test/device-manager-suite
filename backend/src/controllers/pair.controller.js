const Device = require('../models/device.model');
const { v4: uuidv4 } = require('uuid');

exports.createPairCode = async (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const dev = new Device({ deviceId: uuidv4(), pairCode: code, pairCodeExpiresAt: expiresAt });
  await dev.save();
  res.json({ ok: true, deviceId: dev.deviceId, pairCode: code, expiresAt });
};

exports.confirmPair = async (req, res) => {
  const { pairCode, name, consent } = req.body;
  const dev = await Device.findOne({ pairCode, pairCodeExpiresAt: { $gt: new Date() }});
  if (!dev) return res.status(400).json({ error: 'invalid_pair_code' });
  dev.name = name || dev.name;
  dev.pairedAt = new Date();
  dev.consent = { accepted: !!consent?.accepted, ts: consent?.ts ? new Date(consent.ts) : new Date(), textVersion: consent?.textVersion || ''};
  dev.pairCode = null;
  dev.pairCodeExpiresAt = null;
  await dev.save();

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ deviceId: dev.deviceId, role: 'device' }, process.env.JWT_SECRET, { expiresIn: '365d' });
  res.json({ ok: true, deviceId: dev.deviceId, token });
};
