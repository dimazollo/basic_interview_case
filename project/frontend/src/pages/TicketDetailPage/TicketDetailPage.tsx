import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useApiReq } from '../../utils/useApiReg.ts';

type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'declined';

interface TicketEntity {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignee: string;
}

interface TicketHistoryItem {
  id: string;
  title: string;
  details: string;
  date: string;
}

interface TicketHistory {
  ticketId: string;
  history: TicketHistoryItem[];
}

const statusLabels: Record<TicketStatus, string> = {
  new: 'Новый',
  in_progress: 'В работе',
  resolved: 'Решен',
  declined: 'Отклонен',
};

const statusColors: Record<TicketStatus, 'default' | 'primary' | 'success' | 'error'> = {
  new: 'default',
  in_progress: 'primary',
  resolved: 'success',
  declined: 'error',
};

export const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { run: loadTicket, isLoading, data: ticket } = useApiReq<void, TicketEntity>({
    url: `/api/ticket/${id}`,
    requestMethod: 'GET',
  });

  const { run: loadHistory, isLoading: isHistoryLoading, data: ticketHistory } = useApiReq<void, TicketHistory>({
    url: `/api/ticket/${id}/history`,
    requestMethod: 'GET',
  });

  useEffect(() => {
    if (id) {
      loadTicket();
      loadHistory();
    }
  }, [id]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100%',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Тикет не найден
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 3,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          padding: 3,
          maxWidth: 800,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h4" component="h1">
            {ticket.title}
          </Typography>
          <Chip
            label={statusLabels[ticket.status]}
            color={statusColors[ticket.status]}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            ID тикета
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {ticket.id}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Исполнитель
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {ticket.assignee}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Описание
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {ticket.description}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            История тикета
          </Typography>

          {isHistoryLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : ticketHistory && ticketHistory.history && ticketHistory.history.length > 0 ? (
            <List sx={{ bgcolor: 'background.paper' }}>
              {ticketHistory.history.map((item, index) => (
                <ListItem
                  key={item.id}
                  sx={{
                    borderBottom: index < ticketHistory.history.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    alignItems: 'flex-start',
                    px: 0,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2, flexShrink: 0 }}>
                          {item.date}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.details}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              История отсутствует
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
