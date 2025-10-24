// ws-stream-server.js
const https = require('https');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const url = require('url');
const jwt = require('jsonwebtoken');
const { spawn } = require('child_process');
const mkdirp = require('mkdirp');

const CERT_KEY = process.env.CERT_KEY || '/path/to/privkey.pem';
const CERT_CRT = process.env.CERT_CRT || '/path/to/cert.pem';
const PORT = process.env.WS_PORT || 8443;
const OUT_DIR = process.env.WS_OUT_DIR || path.join(__dirname, '..', 'media_streams');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

mkdirp.sync(OUT_DIR);

const serverOptions = {
  key: fs.readFileSync(CERT_KEY),
  cert: fs.readFileSync(CERT_CRT)
};

const server = https.createServer(serverOptions, (req, res) => {
  res.writeHead(200); res.end('ws stream server');
});

const wss = new WebSocket.Server({ noServer: true, maxPayload: 10 * 1024 * 1024 });

wss.on('connection', (ws, req) => {
  const qs = url.parse(req.url, true).query;
  const token = qs.token || null;
  let deviceId = 'unknown';
  try {
    if (!token) throw new Error('no_token');
    const payload = jwt.verify(token, JWT_SECRET);
    deviceId = payload.deviceId || payload.id || 'unknown';
  } catch (err) {
    console.error('JWT verify failed:', err.message || err);
    ws.close(4001, 'auth failed');
    return;
  }

  console.log('stream connected from device:', deviceId, 'ip:', req.socket.remoteAddress);

  const ts = Date.now();
  const pcmPath = path.join(OUT_DIR, `stream_${deviceId}_${ts}.pcm`);
  const out = fs.createWriteStream(pcmPath, { flags: 'w' });

  ws.on('message', (data) => {
    if (typeof data === 'string') return;
    out.write(data);
  });

  ws.on('close', (code, reason) => {
    console.log(`ws closed ${deviceId} code=${code} reason=${reason}`);
    out.end(() => {
      const m4aPath = pcmPath.replace('.pcm', '.m4a');
      const ff = spawn('ffmpeg', [
        '-f', 's16le',
        '-ar', '16000',
        '-ac', '1',
        '-i', pcmPath,
        '-c:a', 'aac',
        '-b:a', '64k',
        m4aPath
      ]);
      ff.stderr.on('data', d => console.log('ffmpeg:', d.toString()));
      ff.on('close', (code) => {
        console.log('ffmpeg finished:', code, 'created', m4aPath);
        try {
          fs.writeFileSync(pcmPath + '.json', JSON.stringify({ deviceId, ts, pcmPath, m4aPath }));
        } catch (e) { console.error('meta write err', e); }
      });
    });
  });

  ws.on('error', (err) => {
    console.error('ws error', err);
    out.end();
  });
});

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

server.listen(PORT, () => console.log('WSS server listening on', PORT));
