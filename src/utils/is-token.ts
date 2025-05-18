import type { Token } from '../types/token';

export function isToken(token: unknown): token is Token {
  if (typeof token !== 'object' || token === null) return false;

  if ('refreshToken' in token && typeof token.refreshToken === 'string') return true;

  return false;
}
