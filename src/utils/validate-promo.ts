import { ref } from 'vue';
import { Errors } from '../enums/errors';

const surnameError = ref<string>('');

export function validatePromo(value: string): string {
  const valueTrim = value.trim();
  const errorMessageSpace = Errors.PromoFormat;
  const errorMessage = Errors.SurnameFormat;
  const result = isSuname(value) ? '' : value === valueTrim ? errorMessage : errorMessageSpace;
  surnameError.value = result;
  return result;
}
function isSuname(surname: string): boolean {
  const regex = /^[A-Za-zЁА-яё]+$/;
  return regex.test(surname);
}
