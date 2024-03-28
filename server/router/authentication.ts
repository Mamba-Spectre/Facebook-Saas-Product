import express from 'express';

import { facebookUserCheck, login, logout, register } from '../controllers/authentication';

// export default (router: express.Router) => {
//   router.post('/auth/register', register);
//   router.post('/auth/login', login);
//   router.post('/auth/facebook',facebookUserCheck);
//   router.get('/auth/logout',logout)
// };
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/facebook',facebookUserCheck);
router.get('/logout',logout)
export default router; 