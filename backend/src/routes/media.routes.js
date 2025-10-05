const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const controller = require('../controllers/media.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/checksum', authMiddleware.deviceOrAdmin, controller.checksum);
router.post('/:deviceId', authMiddleware.deviceOnly, upload.single('media'), controller.upload);
router.get('/stream/:gridFsId', authMiddleware.adminOnly, controller.stream);

module.exports = router;
