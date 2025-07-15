import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../configs/env.js';

const JWT_SECRET = env.JWT_SECRET as string;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
