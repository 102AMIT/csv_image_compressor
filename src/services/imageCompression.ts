import axios from "axios";
import sharp from "sharp";
import AWS from "aws-sdk";
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_ID || "",
    secretAccessKey: process.env.S3_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "",
});

const s3 = new AWS.S3();

export const compressImage = async (imageDocument: any) => {
    if (imageDocument.status === "completed") {
        return {
            requestId: imageDocument.requestId,
            errors: ["Image already processed"],
        };
    }

    const outputUrls: string[] = [];
    for (const url of imageDocument.inputUrls) {
        console.log(`Processing image from URL: ${url}`);
        try {
            const compressedImageBuffer = await downloadAndCompressImage(url);
            console.log(`Image downloaded and compressed successfully for URL: ${url}`);

            const s3Url = await uploadToS3(imageDocument.requestId, compressedImageBuffer);
            console.log(`Image uploaded to S3: ${s3Url}`);
            outputUrls.push(s3Url);
        } catch (err: any) {
            console.error(`Error processing image ${url}: ${err.message}`);
            return { requestId: imageDocument.requestId, errors: [`Failed to process ${url}: ${err.message}`] };
        }
    }

    imageDocument.outputUrls = outputUrls;
    imageDocument.status = "completed";
    await imageDocument.save();

    console.log(`All images processed for request ID: ${imageDocument.requestId}`);
    return { requestId: imageDocument.requestId, errors: [] };
};


const downloadAndCompressImage = async (url: string) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    if (response.status !== 200) {
        throw new Error(`Failed to download image from ${url}`);
    }

    const imageBuffer = Buffer.from(response.data);
    return await sharp(imageBuffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();
};

const uploadToS3 = async (requestId: string, imageBuffer: Buffer) => {
    const outputFileName = `${requestId}-${Date.now()}.jpg`;
    const s3Result = await s3.upload({
        Bucket: process.env.S3_BUCKET || '',
        Key: `compressed_images/${outputFileName}`,
        Body: imageBuffer,
        ACL: 'public-read',
        ContentType: 'image/jpeg',
    }).promise();

    if (!s3Result.Location) {
        throw new Error('Failed to obtain S3 URL after upload');
    }

    return s3Result.Location;
};
