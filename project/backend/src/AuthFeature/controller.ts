import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByLogin, verifyPassword } from './storage';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

router.post('/auth', (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400).json({ error: 'Login and password are required' });
    return;
  }

  const user = findUserByLogin(login);

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const isPasswordValid = verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { login: user.login },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

export default router;
