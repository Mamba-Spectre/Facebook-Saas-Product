import express from 'express';

import { getAllUsers, deleteUser, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

// export default (router: express.Router) => {
//   router.get('/users', isAuthenticated, getAllUsers);
//   router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
//   router.post('/users/:id', isAuthenticated, isOwner, updateUser);
// };
const router = express.Router();
router.get('/', isAuthenticated, getAllUsers);
router.delete('/:id', isAuthenticated, isOwner, deleteUser);
router.post('/:id', isAuthenticated, isOwner, updateUser);
export default router;