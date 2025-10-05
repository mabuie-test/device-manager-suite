const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TelemetrySchema = new Schema({
  deviceId: String,
  ts: { type: Date, default: Date.now },
  location: { lat: Number, lon: Number, acc: Number },
  appsUsage: Array,
  installedApps: Array,
  callLogSummary: Array,
  smsSummary: Array,
  notificationsMeta: Array
}, { timestamps: true });

module.exports = mongoose.model('Telemetry', TelemetrySchema);
