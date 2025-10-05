const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LicenseSchema = new Schema({
  key: String,
  issuedTo: String,
  issuedBy: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  usedAt: Date
});
module.exports = mongoose.model('License', LicenseSchema);
