import { Box, Typography, Paper } from '@mui/material';

export const HomePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Typography variant="h4" component="h1" align="center">
          Welcome to Tabby frontend interview test case
        </Typography>
      </Paper>
    </Box>
  );
};
