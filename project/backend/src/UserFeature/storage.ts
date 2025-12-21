import { randomUUID } from 'crypto';
import { authUsers } from '../AuthFeature/storage';
import { UserEntity } from './types';

export const users: UserEntity[] = [
  {
    id: randomUUID(),
    login: authUsers[0].login,
    name: 'Ahmed Al-Rashid',
    role: 'agent',
  },
  {
    id: randomUUID(),
    login: authUsers[1].login,
    name: 'Fatima Hassan',
    role: 'manager',
  },
  {
    id: randomUUID(),
    login: authUsers[2].login,
    name: 'Omar Al-Mansour',
    role: 'supervisor',
  },
];

export const findUserByLogin = (login: string): UserEntity | undefined => {
  return users.find((user) => user.login === login);
};
