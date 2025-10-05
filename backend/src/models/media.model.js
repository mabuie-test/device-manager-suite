const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
  deviceId: String,
  filename: String,
  gridFsId: mongoose.Types.ObjectId,
  size: Number,
  checksum: String,
  ts: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Media', MediaSchema);
