import jwt from 'jsonwebtoken';

const JWT_TAJNA = process.env.JWT_SECRET || 'dev-secret';
const JWT_TRAJANJE = process.env.JWT_EXPIRES_IN || '7d';

export function napraviToken(payload: object) {
  return jwt.sign(payload, JWT_TAJNA, { expiresIn: JWT_TRAJANJE });
}

export function verifikujToken(token: string) {
  return jwt.verify(token, JWT_TAJNA) as any;
}
