import { Request, Response } from 'express';
import { parseCSV } from '../utils/csvParser';
import { validateCSV } from '../validator/csvValidator';
import { ImageModel } from '../models/ImageModel';
import { processImages } from '../services/imageService';
import fs from 'fs/promises';
import path from 'path';

export const uploadCSV = async (req: Request, res: Response): Promise<Response> => {
    const csvFile = req.file;

    if (!csvFile) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const csvFilePath = path.resolve(csvFile.path);
        const csvData = await fs.readFile(csvFilePath, 'utf-8');
        const records = await parseCSV(csvData);

        if (!validateCSV(records)) {
            return res.status(400).json({ message: 'Invalid CSV format' });
        }

        const { requestId, errors } = await processImages(records, process.env.WEBHOOK_URL || '');

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Error processing images', errors });
        }

        return res.status(202).json({ requestId });
    } catch (err: any) {
        console.error(`Upload CSV Error: ${err.message}`);
        return res.status(500).json({ message: "Error in uploading CSV", error: err.message });
    } finally {
        if (csvFile.path) {
            try {
                await fs.unlink(csvFile.path);
            } catch (err: any) {
                console.error(`Error deleting file: ${err.message}`);
            }
        }
    }
};


export const checkStatus = async (req: Request, res: Response): Promise<Response> => {
    const { requestId } = req.params;

    if (!requestId) {
        return res.status(400).json({ message: 'Request ID is required' });
    }

    try {
        const images = await ImageModel.find({ requestId });

        if (images.length === 0) {
            return res.status(404).json({ message: 'Request ID not found' });
        }

        return res.status(200).json({ requestId, images });
    } catch (err: any) {
        console.error(`Check Status Error: ${err.message}`);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
