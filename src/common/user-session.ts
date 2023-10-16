import { User } from '@prisma/client';

export type UserSession = {
  authenticated: boolean;
  user: User;
};
