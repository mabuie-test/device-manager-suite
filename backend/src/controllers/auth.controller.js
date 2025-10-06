const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const config = require('../config');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'missing_fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'exists' });
    const hash = await bcrypt.hash(password, 10);
    const u = new User({ email, passwordHash: hash, name });
    await u.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ error: 'server_error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'missing_fields' });
    const u = await User.findOne({ email });
    if (!u) return res.status(401).json({ error: 'invalid_credentials' });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
    const payload = { id: u._id.toString(), role: u.role, email: u.email };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' });
    res.json({ token, userId: u._id.toString(), role: u.role, active: u.active });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'server_error' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ ok:false, error:'no_auth' });
    res.json({ ok: true, user });
  } catch (err) {
    console.error('me error', err);
    res.status(500).json({ ok:false, error:'server_error' });
  }
};