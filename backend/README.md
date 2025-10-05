# Backend Device Manager

1. Copia .env.example -> .env e define MONGO_URI e JWT_SECRET
2. npm install
3. npm run dev

Endpoints úteis:
- POST /api/auth/register  {email,password,name}  (use 1 vez para criar admin)
- POST /api/auth/login     {email,password} -> {token}
- POST /api/pair/create    (admin auth) -> cria pairCode + deviceId
- POST /api/pair/confirm   {pairCode,name,consent} -> retorna {deviceId,token} (device token)
- POST /api/telemetry/:deviceId  (device token) -> enviar telemetria json
- POST /api/media/:deviceId (device token, multipart form 'media') -> upload para GridFS
- POST /api/media/checksum (device/admin token): {checksum,size} -> exists?
- GET  /api/media/stream/:gridFsId (admin) -> stream media
- GET  /api/telemetry/:deviceId/history?from=&to=  (admin/device) -> histórico
