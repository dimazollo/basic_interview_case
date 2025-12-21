export type UserRole = 'agent' | 'manager' | 'supervisor';

export interface UserEntity {
  id: string;
  login: string;
  name: string;
  role: UserRole;
}
