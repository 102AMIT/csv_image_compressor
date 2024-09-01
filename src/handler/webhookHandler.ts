import axios from "axios";

interface WebhookResponse {
    success: boolean;
    errors?: string[];
}

export const triggerWebhook = async (requestId: string, webhookUrl: string): Promise<WebhookResponse> => {
    try {
        await axios.post(webhookUrl, {
            message: "Image processing completed",
            requestId,
            timestamp: new Date().toISOString(),
        }, {
            timeout: 5000,
        });
        console.log(`Webhook triggered for requestId: ${requestId}`);
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to trigger webhook for requestId ${requestId}: ${error.message}`);
        return {
            success: false,
            errors: [error.message],
        };
    }
};
