import { type ApiError } from '../types/api-error';
export function isCorrectError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) return false;
  if ('message' in error && typeof error.message === 'string') return true;
  return false;
}
