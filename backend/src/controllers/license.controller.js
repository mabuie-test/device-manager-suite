const License = require('../models/license.model');
const { v4: uuidv4 } = require('uuid');

exports.generate = async (req, res) => {
  const { issuedTo, expiresInDays } = req.body;
  const key = uuidv4().replace(/-/g,'').slice(0,16).toUpperCase();
  const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays*24*3600*1000) : null;
  const l = new License({ key, issuedTo, issuedBy: req.user?.email || 'admin', expiresAt });
  await l.save();
  res.json({ ok:true, key, expiresAt });
};
