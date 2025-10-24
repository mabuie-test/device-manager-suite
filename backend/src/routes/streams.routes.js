// backend/routes/streams.routes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// pasta onde estão as gravações convertidas (.m4a)
const OUT_DIR = process.env.WS_OUT_DIR || path.join(__dirname, '..', 'media_streams');

// lista gravações
router.get('/', /* opcional: auth middleware */ async (req, res) => {
  try {
    if (!fs.existsSync(OUT_DIR)) return res.json({ ok:true, files: [] });
    const files = fs.readdirSync(OUT_DIR)
      .filter(f => f.endsWith('.m4a'))
      .map(f => {
        const full = path.join(OUT_DIR, f);
        const stat = fs.statSync(full);
        return { filename: f, size: stat.size, mtime: stat.mtime };
      })
      .sort((a, b) => b.mtime - a.mtime);
    res.json({ ok:true, files });
  } catch (e) {
    console.error('streams list err', e);
    res.status(500).json({ ok:false, error: e.message });
  }
});

// download por ficheiro
router.get('/download/:file', /* opcional: auth middleware */ (req, res) => {
  const file = req.params.file;
  const full = path.join(OUT_DIR, file);
  if (!fs.existsSync(full)) return res.status(404).send('not found');
  res.download(full);
});

module.exports = router;
