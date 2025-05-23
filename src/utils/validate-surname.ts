import { ref } from 'vue';
import { Errors } from '../../src/assets/constants';

const surnameError = ref<string>('');

export function validateSurame(value: string): string {
  const valueTrim = value.trim();
  const errorMessageSpace = Errors.SurnameSpace;
  const errorMessage = Errors.SurnameFormat;
  const result = isSuname(value) ? '' : value === valueTrim ? errorMessage : errorMessageSpace;
  surnameError.value = result;
  return result;
}
function isSuname(surname: string): boolean {
  const regex = /^[A-Za-zЁА-яё]+$/;
  return regex.test(surname);
}
