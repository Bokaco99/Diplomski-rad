import { type ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validiraj<T>(
  schema: ZodType<T>,
  deo: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse((req as any)[deo]);
    if (!result.success) {
      return res.status(400).json({
        greska: 'Neispravni podaci',
        detalji: result.error.issues.map(i => ({ polje: i.path.join('.'), poruka: i.message })),
      });
    }
    (req as any)[deo] = result.data as T;
    next();
  };
}

