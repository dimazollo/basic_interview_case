export type TicketStatus = "new" | "pending" | "resolved" | "declained";

export type TicketUrgency = 1 | 2 | 3 | 4 | 5;

export interface TicketEntity {
  id: string;
  title: string;
  description: string;
  creationDate: Date;
  resolutionDate: Date | null;
  urgency: TicketUrgency;
  status: TicketStatus;
}
