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
  Grid,
  Button,
} from '@mui/material';
import { useApiReq } from '../../utils/useApiReg.ts';

type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'declined';
type UserRole = 'agent' | 'manager' | 'supervisor';

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

interface UserEntity {
  id: string;
  login: string;
  name: string;
  role: UserRole;
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

const roleLabels: Record<UserRole, string> = {
  agent: 'Агент',
  manager: 'Менеджер',
  supervisor: 'Супервайзер',
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

  const { run: loadUser, isLoading: isUserLoading, data: assigneeUser } = useApiReq<void, UserEntity>({
    url: `/api/user/${ticket?.assignee}`,
    requestMethod: 'GET',
  });

  useEffect(() => {
    if (id) {
      loadTicket();
      loadHistory();
    }
  }, [id]);

  useEffect(() => {
    if (ticket?.assignee) {
      loadUser();
    }
  }, [ticket?.assignee]);

  const getAvailableStatuses = (currentStatus: TicketStatus): TicketStatus[] => {
    if (currentStatus === 'new') {
      return ['in_progress', 'resolved', 'declined'];
    }
    if (currentStatus === 'in_progress') {
      return ['resolved', 'declined'];
    }
    return []; // resolved or declined - no transitions available
  };

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
        gap: 3,
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
        {getAvailableStatuses(ticket.status).length > 0 && (
            <Paper
                elevation={2}
                sx={{
                    padding: 3,
                    maxWidth: 1200,
                    width: '100%',
                    margin: '0 auto',
                }}
            >
                <Typography variant="h6" component="h3" gutterBottom>
                    Изменить статус
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {getAvailableStatuses(ticket.status).map((status) => (
                        <Button
                            key={status}
                            variant="contained"
                            color={statusColors[status]}
                        >
                            {statusLabels[status]}
                        </Button>
                    ))}
                </Box>
            </Paper>
        )}
      <Paper
        elevation={2}
        sx={{
          padding: 3,
          maxWidth: 1200,
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

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              ID тикета
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {ticket.id}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Исполнитель
            </Typography>
            {isUserLoading ? (
              <CircularProgress size={20} />
            ) : assigneeUser ? (
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {assigneeUser.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {roleLabels[assigneeUser.role]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {assigneeUser.login}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                ID: {ticket.assignee}
              </Typography>
            )}
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Описание
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {ticket.description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          padding: 3,
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
        }}
      >
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
      </Paper>
    </Box>
  );
};
