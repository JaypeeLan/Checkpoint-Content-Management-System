const path = require('path');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const { env } = require('../config/env');

function buildSignaturePayload(filename) {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  }

  const ext = path.extname(filename || '').replace('.', '');
  const basename = path.basename(filename || 'upload', path.extname(filename || ''));
  const safeBase = basename.replace(/[^a-zA-Z0-9_-]/g, '-');
  const publicId = `${safeBase}-${Date.now()}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = env.CLOUDINARY_FOLDER || 'educms';

  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
      public_id: publicId,
      timestamp
    },
    env.CLOUDINARY_API_SECRET
  );

  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    folder,
    publicId,
    timestamp,
    signature,
    resourceType: 'auto',
    fileExtension: ext || null
  };
}

module.exports = { buildSignaturePayload };
