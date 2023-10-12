import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES, roles);
