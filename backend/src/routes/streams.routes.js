 const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const OUT_DIR = process.env.WS_OUT_DIR || path.join(__dirname, '..', 'media_streams');

// list
router.get('/', /* auth.adminOrOwner */ async (req, res) => {
  try {
    const files = fs.readdirSync(OUT_DIR)
      .filter(f => f.endsWith('.m4a'))
      .map(f => {
        const full = path.join(OUT_DIR, f);
        const stat = fs.statSync(full);
        return { filename: f, size: stat.size, mtime: stat.mtime };
      })
      .sort((a,b) => b.mtime - a.mtime);
    res.json({ ok:true, files });
  } catch (e) {
    console.error('streams list err', e);
    res.status(500).json({ ok:false });
  }
});

// download
router.get('/download/:file', /* auth.adminOrOwner */ (req, res) => {
  const file = req.params.file;
  const full = path.join(OUT_DIR, file);
  if (!fs.existsSync(full)) return res.status(404).send('not found');
  res.download(full);
}); 

module.exports = router;
