// Backend/src/controllers/contacts.controller.js
const Telemetry = require('../models/telemetry.model');

/**
 * GET /api/contacts/:deviceId
 * Returns aggregated contacts for device (adminOrOwner)
 */
exports.listByDevice = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    if (!deviceId) return res.status(400).json({ ok:false, error:'missing_device' });

    // busca os últimos documentos de telemetria com type = 'contacts'
    const docs = await Telemetry.find({ deviceId, 'payload.type': 'contacts' })
      .sort({ ts: -1 }).limit(30).lean();

    // agrupa e deduplica por número (apenas últimos valores)
    const map = new Map();
    for (const d of docs) {
      // payload pode ser { type: 'contacts', payload: [ {...}, ... ] }
      const p = d.payload && (d.payload.payload || d.payload);
      if (!p) continue;
      const arr = Array.isArray(p) ? p : (Array.isArray(d.payload) ? d.payload : []);
      for (const c of arr) {
        try {
          const numRaw = (c.number || c.phone || '').toString();
          const numNorm = numRaw.replace(/\D/g, '');
          if (!numNorm) continue;
          if (!map.has(numNorm)) {
            map.set(numNorm, { name: c.name || c.displayName || '', number: c.number || c.phone || '' });
          }
        } catch (e) {
          // ignore malformed items
        }
      }
    }

    const contacts = Array.from(map.values());
    res.json({ ok:true, contacts, total: contacts.length });
  } catch (err) {
    console.error('contacts.listByDevice error', err);
    res.status(500).json({ ok:false, error:'server_error' });
  }
};
