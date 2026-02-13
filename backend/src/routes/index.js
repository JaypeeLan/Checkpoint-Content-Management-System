const express = require('express');
const swaggerUi = require('swagger-ui-express');
const healthRoutes = require('./health');
const authRoutes = require('./auth');
const mediaRoutes = require('./media');
const searchRoutes = require('./search');
const analyticsRoutes = require('./analytics');
const postRoutes = require('./posts');
const categoryRoutes = require('./categories');
const tagRoutes = require('./tags');
const commentRoutes = require('./comments');
const { swaggerSpec } = require('../docs/swagger');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/comments', commentRoutes);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
