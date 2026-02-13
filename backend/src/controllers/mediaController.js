const { buildSignaturePayload } = require('../services/cloudinaryService');
const { increment } = require('../services/analyticsService');

async function getUploadSignature(req, res, next) {
  try {
    const { filename } = req.body;
    const data = buildSignaturePayload(filename);
    increment('mediaUploadsRequested');
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUploadSignature };
