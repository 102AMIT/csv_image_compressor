import express from 'express';
import { checkStatus, uploadCSV } from '../contollers/imageController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload', upload.single('file'), uploadCSV);
router.get('/status/:requestId', checkStatus);

export default router;
