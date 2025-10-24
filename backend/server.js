 require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

// socket.io
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// connect mongo
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/devicemgr';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // gridfs bucket
    const mongodb = require('mongodb');
    const conn = mongoose.connection;
    const gridfsBucket = new mongodb.GridFSBucket(conn.db, { bucketName: 'media' });
    app.set('gridfsBucket', gridfsBucket);
  })
  .catch(err => { console.error('Mongo connection error', err); process.exit(1); });

// routes - primary router
try {
  app.use('/api', require('./src/routes'));
  console.log('Loaded main routes from ./src/routes');
} catch (e) {
  console.error('Failed to load ./src/routes:', e.message);
}

// static frontend
app.use('/', express.static(path.join(__dirname, '../web-frontend')));

// --- Safe-loading / flexible-loading for streams route ---
// Try a list of likely module paths first, then attempt an intelligent scan of src/routes
(function loadStreamsRoute() {
  const candidates = [
    './src/routes/streams.routes',
    './src/routes/streams',
    './src/routes/routesxyz',   // common alternate name you mentioned
    './routes/streams.routes',
    './routes/streams'
  ];

  let loaded = false;

  for (const c of candidates) {
    try {
      const modPath = path.join(__dirname, c);
      if (fs.existsSync(modPath + '.js') || fs.existsSync(modPath)) {
        const router = require(c);
        if (router) {
          app.use('/api/streams', router);
          console.log(`Loaded streams router from '${c}'`);
          loaded = true;
          break;
        }
      }
    } catch (err) {
      // continue trying other candidates
      console.warn(`Attempt to load '${c}' failed: ${err && err.message}`);
    }
  }

  if (loaded) return;

  // fallback: scan backend/src/routes for files that look like stream route modules
  try {
    const routesDir = path.join(__dirname, 'src', 'routes');
    if (fs.existsSync(routesDir) && fs.statSync(routesDir).isDirectory()) {
      const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));
      // prefer files with 'stream' in the name
      const ordered = files.sort((a,b) => {
        const aScore = (a.toLowerCase().includes('stream') ? 0 : 1);
        const bScore = (b.toLowerCase().includes('stream') ? 0 : 1);
        return aScore - bScore;
      });

      for (const f of ordered) {
        const rel = './src/routes/' + f.replace(/\.js$/, '');
        try {
          const router = require(rel);
          if (router) {
            app.use('/api/streams', router);
            console.log(`Loaded streams router by scan from './src/routes/${f}'`);
            loaded = true;
            break;
          }
        } catch (err) {
          console.warn(`Scan attempt to load './src/routes/${f}' failed: ${err && err.message}`);
        }
      }
    }
  } catch (scanErr) {
    console.warn('Error scanning src/routes for streams route:', scanErr && scanErr.message);
  }

  if (!loaded) {
    console.warn('No streams route found — continuing without /api/streams (create backend/routes/streams.routes.js or a module under src/routes to enable it).');
  }
})();
// --- end safe-loading ---

// error / fallback
app.use((req, res) => res.status(404).json({ error: 'not_found' }));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server listening on', PORT));
