import { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

export const TicketsPage = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  const { run: loadTickets, isLoading, data: tickets } = useApiReq<void, TicketEntity[]>({
    url: '/api/tickets',
    requestMethod: 'GET',
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];

    return tickets.filter((ticket) => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchText, statusFilter]);

  const handleTicketClick = (ticketId: string) => {
    history.push(`/ticket/${ticketId}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Мои тикеты
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Поиск по названию"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            label="Статус"
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="new">Новый</MenuItem>
            <MenuItem value="in_progress">В работе</MenuItem>
            <MenuItem value="resolved">Решен</MenuItem>
            <MenuItem value="declined">Отклонен</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper
        elevation={2}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredTickets.length > 0 ? (
          <List
            sx={{
              flex: 1,
              overflow: 'auto',
              padding: 0,
            }}
          >
            {filteredTickets.map((ticket) => (
              <ListItem
                key={ticket.id}
                onClick={() => handleTicketClick(ticket.id)}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{ticket.title}</Typography>
                      <Chip
                        label={statusLabels[ticket.status]}
                        color={statusColors[ticket.status]}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        {ticket.description}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        ID: {ticket.id}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Нет тикетов
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
