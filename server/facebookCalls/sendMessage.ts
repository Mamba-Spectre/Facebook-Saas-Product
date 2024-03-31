import axios from 'axios';
export async function sendReplyToFacebook(accessToken: string, recipientId: string, content: string): Promise<void> {
    try {
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
        // console.error('Failed to send message to Facebook', error);
    }
}