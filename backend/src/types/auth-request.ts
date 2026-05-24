import { Request } from 'express';
import { UserDocument } from '../users/schemas/user.schema';

export type AuthRequest = Request & {
  user: UserDocument;
};

export type JwtRefreshRequest = Request & {
  user: {
    sub: string;
    refreshToken: string;
  };
};
