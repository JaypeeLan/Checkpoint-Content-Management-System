require('dotenv').config();
const http = require('http');
const { app } = require('./app');
const { env } = require('./config/env');
const { initWebsocket } = require('./services/websocketService');
const { ensureIndex } = require('./services/searchService');

const server = http.createServer(app);
initWebsocket(server);

ensureIndex().catch((e) => {
  console.error('Elasticsearch bootstrap failed:', e.message);
});

server.listen(env.PORT, () => {
  console.log(`EduCMS API running on port ${env.PORT}`);
});
