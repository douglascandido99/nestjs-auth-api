import { User } from '@prisma/client';

export type CleanUser = Omit<User, 'hash'>;
