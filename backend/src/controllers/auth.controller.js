const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(401).json({ error: 'invalid_credentials' });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
    const token = jwt.sign({ sub: u._id, role: u.role, email: u.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: u.email, name: u.name }});
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'server_error' });
  }
};

// Register admin (one-time). Protect or manually run via DB for production.
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'exists' });
    const hash = await bcrypt.hash(password, 10);
    const u = new User({ email, passwordHash: hash, name, role: 'admin' });
    await u.save();
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'server_error' }); }
};
