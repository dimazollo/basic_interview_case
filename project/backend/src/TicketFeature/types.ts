export type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'declined';

export interface TicketEntity {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignee: string;
}
