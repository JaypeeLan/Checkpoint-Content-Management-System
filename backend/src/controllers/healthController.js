function health(req, res) {
  res.json({
    success: true,
    message: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}

module.exports = { health };
