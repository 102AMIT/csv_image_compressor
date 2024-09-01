import express from 'express';

const router = express.Router();

import imageRoutes from './imageRoutes';
import webhookRoutes from './webhookRoutes';

router.use('/image', imageRoutes);
router.use('/webhook', webhookRoutes);

export default router;