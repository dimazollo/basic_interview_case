import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../UserFeature/middleware';
import { findUserByLogin } from '../UserFeature/storage';
import { findTicketsByAssignee, findTicketById } from './storage';

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

router.get('/ticket/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const login = req.login;
  const ticketId = req.params.id;

  if (!login) {
    res.status(401).json({ error: 'Login not found in token' });
    return;
  }

  const user = findUserByLogin(login);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const ticket = findTicketById(ticketId);

  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  if (ticket.assignee !== user.id) {
    res.status(403).json({ error: 'Access denied: ticket assigned to another user' });
    return;
  }

  res.json(ticket);
});

export default router;
