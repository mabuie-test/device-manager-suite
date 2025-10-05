const Media = require('../models/media.model');
const crypto = require('crypto');

exports.checksum = async (req, res) => {
  try {
    const { checksum, size } = req.body;
    if (!checksum) return res.status(400).json({ error: 'checksum_required' });
    const m = await Media.findOne({ checksum, size });
    if (m) return res.json({ exists: true, mediaId: m._id, gridFsId: m.gridFsId });
    res.json({ exists: false });
  } catch (err) { console.error(err); res.status(500).json({ error: 'server_error' }); }
};

exports.upload = async (req, res) => {
  try {
    const gridfsBucket = req.app.get('gridfsBucket');
    const deviceId = req.params.deviceId;
    if (!req.file) return res.status(400).json({ error: 'file_required' });

    const buf = req.file.buffer;
    const checksum = crypto.createHash('sha256').update(buf).digest('hex');

    const exists = await Media.findOne({ checksum, size: req.file.size });
    if (exists) {
      return res.json({ ok: true, exists: true, id: exists._id });
    }

    const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
      metadata: { deviceId, checksum }
    });
    uploadStream.end(buf);
    uploadStream.on('finish', async (file) => {
      const m = new Media({
        deviceId,
        filename: req.file.originalname,
        gridFsId: file._id,
        size: req.file.size,
        checksum
      });
      await m.save();
      res.json({ ok: true, id: m._id, gridFsId: file._id });
    });
    uploadStream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'upload_error' });
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'server_error' }); }
};

exports.stream = async (req, res) => {
  try {
    const gridfsBucket = req.app.get('gridfsBucket');
    const id = req.params.gridFsId;
    const mongodb = require('mongodb');
    const _id = new mongodb.ObjectId(id);
    const download = gridfsBucket.openDownloadStream(_id);
    download.on('error', (e) => {
      res.sendStatus(404);
    });
    download.pipe(res);
  } catch (err) { console.error(err); res.status(500).json({ error: 'stream_error' }); }
};
