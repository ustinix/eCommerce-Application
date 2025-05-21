import { ref } from 'vue';

const surnameError = ref<string>('');

export function validateSurame(value: string): string {
  const valueTrim = value.trim();
  const errorMessageSpace = 'Surname must not contain leading or trailing whitespace.';
  const errorMessage =
    'The surname must contain at least one character and no special characters or numbers.';
  const result = isSuname(value) ? '' : value === valueTrim ? errorMessage : errorMessageSpace;
  surnameError.value = result;
  return result;
}
function isSuname(surname: string): boolean {
  const regex = /^[A-Za-zЁА-яё]+$/;
  return regex.test(surname);
}
