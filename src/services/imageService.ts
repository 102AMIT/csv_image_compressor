import { triggerWebhook } from "../handler/webhookHandler";
import { ImageModel } from "../models/ImageModel";
import { compressImage } from "./imageCompression";
import { v4 as uuidv4 } from "uuid";

export const processImages = async (records: any[], webhookUrl?: string) => {
    console.log("Processing images...", webhookUrl);
    let requestId = '';
    const errors: string[] = [];

    for (const record of records) {
        try {
            requestId = uuidv4()
            const imageDocument = await saveImageRecord(record, requestId);
            const compressionResult = await compressImage(imageDocument);

            if (compressionResult.errors.length > 0) {
                return {
                    requestId: compressionResult.requestId,
                    errors: compressionResult.errors,
                    message: true,
                };
            }
        } catch (err: any) {
            console.error(`Error processing record ${record["Product Name"]}: ${err.message}`);
            return { requestId, errors: [err.message] };
        }
    }

    if (errors.length > 0) {
        console.log("Some images could not be processed:", errors);
        return { requestId, errors };
    }

    if (webhookUrl) {
        try {
            console.log("Triggering webhook:", webhookUrl);
            await triggerWebhook(requestId, webhookUrl);
        } catch (err: any) {
            console.error(`Error triggering webhook: ${err.message}`);
            return { requestId, errors: [err.message] };
        }
    }

    return { requestId, errors: [] };
};

const saveImageRecord = async (record: any, requestId: string) => {
    const imageDocument = new ImageModel({
        productName: record["Product Name"],
        inputUrls: record["Input Image Urls"].split(",").map((url: string) => url.trim()),
        requestId,
    });

    await imageDocument.save();
    return imageDocument;
};
