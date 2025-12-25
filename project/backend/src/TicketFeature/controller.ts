import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../UserFeature/middleware';
import { findUserByLogin } from '../UserFeature/storage';
import { findTicketsByAssignee, findTicketById, updateTicketStatus } from './storage';
import { findHistoryByTicketId } from './TicketHistoryFeature/storage';
import { TicketStatus } from './types';

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

router.get('/ticket/:id/history', authenticateToken, (req: AuthRequest, res: Response) => {
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

  const history = findHistoryByTicketId(ticketId);

  if (!history) {
    res.status(404).json({ error: 'Ticket history not found' });
    return;
  }

  res.json(history);
});

router.post('/ticket/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  const login = req.login;
  const ticketId = req.params.id;
  const { status: newStatus } = req.body;

  if (!login) {
    res.status(401).json({ error: 'Login not found in token' });
    return;
  }

  if (!newStatus) {
    res.status(400).json({ error: 'Status is required' });
    return;
  }

  const validStatuses: TicketStatus[] = ['new', 'in_progress', 'resolved', 'declined'];
  if (!validStatuses.includes(newStatus)) {
    res.status(400).json({ error: 'Invalid status value' });
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

  // Validate status transition rules
  if (ticket.status === 'resolved' || ticket.status === 'declined') {
    res.status(400).json({ error: 'Cannot change status of resolved or declined tickets' });
    return;
  }

  if (ticket.status === 'in_progress' && newStatus !== 'resolved' && newStatus !== 'declined') {
    res.status(400).json({ error: 'Ticket in progress can only be changed to resolved or declined' });
    return;
  }

  const updatedTicket = updateTicketStatus(ticketId, newStatus);

  if (!updatedTicket) {
    res.status(500).json({ error: 'Failed to update ticket status' });
    return;
  }

  res.json(updatedTicket);
});

export default router;
