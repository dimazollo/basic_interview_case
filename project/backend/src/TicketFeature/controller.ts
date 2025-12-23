import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../UserFeature/middleware';
import { findUserByLogin } from '../UserFeature/storage';
import { findTicketsByAssignee } from './storage';

const router = Router();

router.get('/tickets', authenticateToken, (req: AuthRequest, res: Response) => {
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

  const tickets = findTicketsByAssignee(user.id);

  res.json(tickets);
});

export default router;
