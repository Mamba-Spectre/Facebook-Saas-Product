import express from 'express';

import authentication from './authentication';
import users from './users';
import facebookCalls from './facebookCalls';

const router = express.Router();

router.use('/auth', authentication);
router.use('/facebook', facebookCalls);
router.use('/users', users);
export default router;