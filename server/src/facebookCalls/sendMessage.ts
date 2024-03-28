import axios from 'axios';
export async function sendReplyToFacebook(accessToken: string, recipientId: string, content: string): Promise<void> {
    try {
        const PAGE_ACCESS_TOKEN = 'EAAMS05ZCPWz4BO49C6c1sOT5LcmtQDyHK7fWjx4AcsShv8XjUsYSuSauDXe0E0ssQkIFnxGcmgjIIYgoEJUq7Wh7EI50e1Rn3hc97cq1ucOEEaBRECrpz1ZBZBr8iwZBxSAS5QZCPeZCnDX7SXUvGSnht3LllhJcG29lZCfbFnLZCOxFrCKfg4LM7ImNlySYumGKawZDZD';
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: content
            }
        };
        await axios.post(`https://graph.facebook.com/v19.0/me/messages?access_token=${accessToken}`, messageData);
    } catch (error) {
        throw new Error('Failed to send message to Facebook');
    }
}