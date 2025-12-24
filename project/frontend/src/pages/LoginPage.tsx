import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import {useApiReq} from "../utils/useApiReg.ts";

interface AuthRequest {
  login: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const { run: loginRequest, isLoading } = useApiReq<AuthRequest, AuthResponse>({
    url: '/api/auth',
    requestMethod: 'POST',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginRequest({ login, password });
      if (response?.token) {
        localStorage.setItem('access_token', response.token);
        console.log('Login successful, token:', response.token);
        // TODO: Redirect to dashboard or tickets page
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

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
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Форма входа
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3 }}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
