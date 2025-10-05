const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  deviceId: { type: String, unique: true },
  name: String,
  pairedAt: Date,
  pairCode: String,
  pairCodeExpiresAt: Date,
  consent: {
    accepted: Boolean,
    ts: Date,
    textVersion: String
  },
  isDeviceOwner: { type: Boolean, default: false },
  lastSeen: Date
});
module.exports = mongoose.model('Device', DeviceSchema);
