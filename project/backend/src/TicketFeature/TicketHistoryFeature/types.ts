export interface TicketHistoryItem {
  id: string;
  title: string;
  details: string;
  date: string; // DD-MM-YYYY hh:mm
}

export interface TicketHistory {
  ticketId: string;
  history: TicketHistoryItem[];
}
