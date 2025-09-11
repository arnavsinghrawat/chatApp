import { IUser } from "../models/User";

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
