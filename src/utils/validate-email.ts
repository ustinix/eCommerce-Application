import { ref } from 'vue';
import { isEmail } from '../utils/is-email';

const emailError = ref<string>('');

export function validateEmail(value: string): string {
  const errorMessageSpace = 'Email address must not contain leading or trailing whitespace';
  const errorMessage = 'Email address must contain an "@" symbol, local part and domain name.';
  const trimmed = value.trim();
  const result = isEmail(value) ? '' : value === trimmed ? errorMessage : errorMessageSpace;
  emailError.value = result;
  return result;
}
