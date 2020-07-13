import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const headerAuth = req.headers.authorization;

  if (!headerAuth) return res.status(401).json({ error: 'No token provided' });

  const [, token] = headerAuth.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(
      token,
      authConfig.authSignature
    );

    req.userId = decoded.id;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token is not Valid' });
  }
};
