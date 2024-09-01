import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

router.post('/web-hook', (req: Request, res: Response) => {
    console.log('Webhook triggered successfully');
    console.log('Received data:', req.body);
    return res.status(200).json({ message: 'Webhook received successfully' });
});

export default router;
