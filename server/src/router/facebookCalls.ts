import express from 'express';
import { allConversations, fullConversation,sendReply } from '../facebookCalls/fetchMessages';
import { isAuthenticated } from '../middlewares';

// export default (router: express.Router) => {
//     router.get('/conversations',isAuthenticated,allConversations);
//     router.get('/messages',isAuthenticated,fullConversation);
//     router.post('/reply',isAuthenticated,sendReply);
// }
const router = express.Router();
router.get('/conversations',isAuthenticated,allConversations);
router.get('/messages',isAuthenticated,fullConversation);
router.post('/reply',isAuthenticated,sendReply);
export default router;