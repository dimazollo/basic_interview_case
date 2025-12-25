import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import { ReactNode, useEffect } from 'react';
import { useApiReq } from '../utils/useApiReg';

interface PageLayoutProps {
  children: ReactNode;
}

type UserRole = 'agent' | 'manager' | 'supervisor';

interface UserEntity {
  id: string;
  login: string;
  name: string;
  role: UserRole;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  const { run: loadUser, data: user } = useApiReq<void, UserEntity>({
    url: '/api/user',
    requestMethod: 'GET',
    skipDefaultErrorHandling: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      loadUser();
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ticket Management System
          </Typography>
          <Typography variant="body1">
            User: {user?.login || 'undefined'} {user?.role || 'undefined'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content Slot */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'auto',
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
