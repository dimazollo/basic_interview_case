import { randomUUID } from 'crypto';
import { tickets } from '../storage';
import { TicketHistory, TicketHistoryItem } from './types';

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const getRandomPastDate = (daysAgo: number): Date => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);

  const date = new Date(now);
  date.setDate(date.getDate() - randomDays);
  date.setHours(randomHours, randomMinutes, 0, 0);

  return date;
};

const addHoursToDate = (date: Date, hours: number): Date => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

const generateHistoryForTicket = (ticketId: string, status: string): TicketHistoryItem[] => {
  const history: TicketHistoryItem[] = [];

  // Creation date - somewhere in the last 30 days
  const creationDate = getRandomPastDate(30);

  // Always add creation item
  history.push({
    id: randomUUID(),
    title: 'Ticket Created',
    details: 'Support ticket has been created and assigned to a team member',
    date: formatDate(creationDate),
  });

  // If status is not 'new', add progression items
  if (status !== 'new') {
    // Add "started working" item (1-24 hours after creation)
    const startedDate = addHoursToDate(creationDate, Math.floor(Math.random() * 24) + 1);

    history.push({
      id: randomUUID(),
      title: 'Status Changed to In Progress',
      details: 'Team member started working on the ticket',
      date: formatDate(startedDate),
    });

    // If status is 'resolved' or 'declined', add final status item
    if (status === 'resolved') {
      const resolvedDate = addHoursToDate(startedDate, Math.floor(Math.random() * 48) + 2);

      history.push({
        id: randomUUID(),
        title: 'Status Changed to Resolved',
        details: 'Issue has been resolved and ticket is closed',
        date: formatDate(resolvedDate),
      });
    } else if (status === 'declined') {
      const declinedDate = addHoursToDate(startedDate, Math.floor(Math.random() * 24) + 1);

      history.push({
        id: randomUUID(),
        title: 'Status Changed to Declined',
        details: 'Ticket has been declined after review',
        date: formatDate(declinedDate),
      });
    }
  }

  return history;
};

const generateAllTicketHistories = (): TicketHistory[] => {
  return tickets.map(ticket => ({
    ticketId: ticket.id,
    history: generateHistoryForTicket(ticket.id, ticket.status),
  }));
};

export const ticketHistories: TicketHistory[] = generateAllTicketHistories();

export const findHistoryByTicketId = (ticketId: string): TicketHistory | undefined => {
  return ticketHistories.find(th => th.ticketId === ticketId);
};
