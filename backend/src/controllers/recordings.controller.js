// Backend/src/controllers/recordings.controller.js
const mongoose = require('mongoose');

exports.listByDevice = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    if (!deviceId) return res.status(400).json({ ok:false, error:'missing_device' });

    const filesColl = mongoose.connection.db.collection('media.files');

    // Filtramos por metadata.deviceId e por contentType audio/* ou filename contendo 'call_'
    const docs = await filesColl.find({
      'metadata.deviceId': deviceId,
      $or: [
        { contentType: { $regex: '^audio/', $options: 'i' } },
        { filename: { $regex: '^call_', $options: 'i' } },
        { 'metadata.originalname': { $regex: '^call_', $options: 'i' } }
      ]
    }).sort({ uploadDate: -1 }).toArray();

    const files = docs.map(d => ({
      fileId: d._id.toString(),
      filename: d.filename,
      originalname: d.metadata && d.metadata.originalname,
      contentType: d.contentType,
      uploadDate: d.uploadDate,
      size: d.length || null,
      downloadUrl: `/api/media/download/${d._id.toString()}`
    }));

    res.json({ ok:true, recordings: files });
  } catch (err) {
    console.error('recordings.listByDevice error', err);
    res.status(500).json({ ok:false, error:'server_error' });
  }
};
