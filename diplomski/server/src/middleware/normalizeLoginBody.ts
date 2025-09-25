import { Request, Response, NextFunction } from 'express';


export function normalizeLoginBody(req: Request, _res: Response, next: NextFunction) {
  const b = req.body as any;
  if (b && typeof b === 'object') {
    if (b.password && !b.lozinka) b.lozinka = b.password;  
    if (b.username && !b.email)   b.email   = b.username;   
    if (typeof b.email === 'string')   b.email = b.email.trim();
    if (typeof b.lozinka === 'string') b.lozinka = b.lozinka.trim();
  }
  next();}