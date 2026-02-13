const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const { applySecurityMiddleware } = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimit');
const { errorHandler } = require('./middleware/errorHandler');
const { increment } = require('./services/analyticsService');

const app = express();

applySecurityMiddleware(app);
app.use(morgan('dev'));
app.use((req, res, next) => {
  increment('totalRequests');
  next();
});
app.use('/api', apiLimiter);
app.use('/api/v1', routes);
app.use(errorHandler);

module.exports = { app };
