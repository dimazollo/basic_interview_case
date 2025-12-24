import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Divider,
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

  useEffect(() => {
    if (id) {
      loadTicket();
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
      </Paper>
    </Box>
  );
};
