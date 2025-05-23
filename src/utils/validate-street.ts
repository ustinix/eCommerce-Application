import { Errors } from '../../src/assets/constants';
export default function validateStreet(value: string): string {
  if (!value || !value.trim()) {
    return Errors.Street;
  }
  if (value !== value.trim()) {
    return Errors.Common;
  }
  return '';
}
