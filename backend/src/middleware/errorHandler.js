function errorHandler(err, req, res, next) {
  if (err && err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist. Check related IDs and try again.'
    });
  }

  if (err && err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate value violates a unique constraint.'
    });
  }

  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Internal server error'
  });
}

module.exports = { errorHandler };