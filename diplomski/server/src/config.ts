import 'dotenv/config';

export const KONFIG = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  jwtTajna: process.env.JWT_TAJNA ?? 'dev_tajna',
  jwtCookieName: process.env.JWT_COOKIE_NAME ?? 'token',
  kursEur: Number(process.env.KURS_EUR ?? 117.5),
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const;
