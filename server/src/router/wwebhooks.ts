import { webhookCheck } from '../controllers/messaging';
import express from 'express';

export default (router: express.Router) => {
    router.get('/webhooks',webhookCheck);
    // router.post('/reply',sendReply);
}