import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { AuthEntity } from './types';

const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

const users: AuthEntity[] = [
  {
    id: randomUUID(),
    login: 'testUser1@test.com',
    passwordHash: hashPassword('password1'),
  },
  {
    id: randomUUID(),
    login: 'testUser2@test.com',
    passwordHash: hashPassword('password2'),
  },
  {
    id: randomUUID(),
    login: 'testUser3@test.com',
    passwordHash: hashPassword('password3'),
  },
];

export const findUserByLogin = (login: string): AuthEntity | undefined => {
  return users.find((user) => user.login === login);
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};
