import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from './middleware';
import { findUserByLogin } from './storage';

const router = Router();

router.get('/user', authenticateToken, (req: AuthRequest, res: Response) => {
  const login = req.login;

  if (!login) {
    res.status(401).json({ error: 'Login not found in token' });
    return;
  }

  const user = findUserByLogin(login);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
});

export default router;
