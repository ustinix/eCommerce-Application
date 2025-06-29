import { ref } from 'vue';
import { isPassword } from '../utils/is-password';
import { Errors } from '../enums/errors';

const passwordError = ref<string>('');

export function validatePassword(value: string): string {
  const errorMessage = Errors.PasswordFormat;
  const result = isPassword(value) ? errorMessage : '';
  passwordError.value = result;
  return result;
}
