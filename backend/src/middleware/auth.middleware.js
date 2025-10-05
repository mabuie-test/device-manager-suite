const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Device = require('../models/device.model');

const getTokenFromHeader = (req) => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  return parts[1];
};

exports.adminOnly = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'no_token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
    req.user = payload;
    next();
  } catch (err) { console.error(err); res.status(401).json({ error: 'invalid_token' }); }
};

exports.deviceOnly = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'no_token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'device') return res.status(403).json({ error: 'forbidden' });
    req.device = payload;
    if (req.params.deviceId && req.params.deviceId !== payload.deviceId) {
      return res.status(403).json({ error: 'invalid_device' });
    }
    next();
  } catch (err) { console.error(err); res.status(401).json({ error: 'invalid_token' }); }
};

exports.adminOrDevice = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'no_token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) { console.error(err); res.status(401).json({ error: 'invalid_token' }); }
};

exports.deviceOrAdmin = async (req,res,next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'no_token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) { console.error(err); res.status(401).json({ error: 'invalid_token' }); }
};
