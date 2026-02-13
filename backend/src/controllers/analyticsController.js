const { getSummary } = require('../services/analyticsService');

function summary(req, res) {
  res.json({ success: true, data: getSummary() });
}

module.exports = { summary };
