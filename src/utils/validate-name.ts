import { ref } from 'vue';

const nameError = ref<string>('');

export function validateName(value: string): string {
  const valueTrim = value.trim();
  const errorMessageSpace = 'Name must not contain leading or trailing whitespace';
  const errorMessage =
    'The name must contain at least one character and no special characters or numbers.';
  const result = isName(value) ? '' : value === valueTrim ? errorMessage : errorMessageSpace;
  nameError.value = result;
  return result;
}
function isName(name: string): boolean {
  const regex = /^[A-Za-zЁА-яё]+$/;
  return regex.test(name);
}
