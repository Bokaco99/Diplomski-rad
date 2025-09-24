import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { KONFIG } from '../config';

const JWT_TAJNA = KONFIG.jwtTajna; // ⟵ IZ JEDNOG MESTA!
const JWT_TRAJANJE: SignOptions['expiresIn'] =
  `${Number(process.env.JWT_EXPIRES_IN_DAYS ?? 7)}d`;

export function napraviToken<T extends object>(payload: T) {
  return jwt.sign(payload, JWT_TAJNA, { expiresIn: JWT_TRAJANJE });
}

export function verifikujToken<T extends object = JwtPayload>(token: string): T {
  const decoded = jwt.verify(token, JWT_TAJNA);
  if (typeof decoded === 'string') {
    throw new Error('Neočekivan string payload u JWT.');
  }
  return decoded as T;
}
