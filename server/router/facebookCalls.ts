import express from 'express';
import { allConversations, fullConversation,sendReply } from '../facebookCalls/fetchMessages';
import { isAuthenticated, profanityfilter } from '../middlewares';

const router = express.Router();
router.get('/conversations',isAuthenticated,allConversations);
router.get('/messages',isAuthenticated,fullConversation);
router.post('/reply',isAuthenticated,profanityfilter,sendReply);
export default router;