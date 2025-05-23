import type { TokenCache } from '@commercetools/sdk-client-v2';
import { encodeToken, decodeToken } from './token-decoder';
import { isToken } from './is-token';

export const tokenCache: TokenCache = {
  get: () => {
    const stored = localStorage.getItem('authToken');
    if (stored) {
      const token = JSON.parse(stored);
      token.refreshToken = isToken(token) ? decodeToken(token.refreshToken) : '';
      return token;
    }

    return null;
  },
  set: token => {
    if (!isToken(token)) return;
    token.refreshToken = encodeToken(token.refreshToken);
    localStorage.setItem('authToken', JSON.stringify(token));
  },
};
