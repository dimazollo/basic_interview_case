import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          padding: 2,
          boxShadow: 1,
          width: '100%',
        }}
      >
        <h1 style={{ margin: 0 }}>Ticket Management System</h1>
      </Box>

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
