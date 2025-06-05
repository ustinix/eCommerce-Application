import { ref } from 'vue';
import { isEmail } from '../utils/is-email';
import { Errors } from '../enums/errors';

const emailError = ref<string>('');

export function validateEmail(value: string): string {
  const errorMessageSpace = Errors.EmailSpace;
  const errorMessage = Errors.EmailFormat;
  const trimmed = value.trim();
  const result = isEmail(value) ? '' : value === trimmed ? errorMessage : errorMessageSpace;
  emailError.value = result;
  return result;
}
