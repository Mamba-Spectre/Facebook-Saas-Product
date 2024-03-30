import express from 'express';

import { facebookUserCheck, login, logout, register } from '../controllers/authentication';

const router = express.Router();
// router.post('/register', register);
router.post('/login', login);
router.post('/facebook',facebookUserCheck);
router.get('/logout',logout)
export default router; 