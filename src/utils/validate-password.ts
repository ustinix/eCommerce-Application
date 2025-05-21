import { ref } from 'vue';
import { isPassword } from '../utils/is-password';

const passwordError = ref<string>('');

export function validatePassword(value: string): string {
  const errorMessage =
    'Password must contain at least 8 characters, uppercase and lowercase letter, number and special character';
  const result = isPassword(value) ? errorMessage : '';
  passwordError.value = result;
  return result;
}
