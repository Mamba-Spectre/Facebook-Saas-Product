import express from 'express';

import authentication from './authentication';
import users from './users';
import facebookCalls from './facebookCalls';

const router = express.Router();

// export default (): express.Router => {
//   authentication(router);
//   users(router);
//   wwebhooks(router);
//   facebookCalls(router);

//   return router;
// };

router.use('/auth', authentication);
router.use('/facebook', facebookCalls);
router.use('/users', users);
export default router;