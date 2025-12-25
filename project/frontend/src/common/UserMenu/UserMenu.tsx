import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';

interface UserMenuProps {
  isLoggedIn: boolean;
}

export const UserMenu = ({ isLoggedIn }: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const history = useHistory();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    handleClose();
    history.push('/login');
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem('access_token');
    window.location.reload();
  };

  const handleMyTickets = () => {
    handleClose();
    history.push('/tickets');
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {!isLoggedIn ? (
          <MenuItem onClick={handleLogin}>
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Login</ListItemText>
          </MenuItem>
        ) : (
          [
            <MenuItem key="my-tickets" onClick={handleMyTickets}>
              <ListItemIcon>
                <TicketIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My tickets</ListItemText>
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>,
          ]
        )}
      </Menu>
    </>
  );
};
