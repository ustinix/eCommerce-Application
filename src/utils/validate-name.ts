import { ref } from 'vue';
import { Errors } from '../../src/assets/constants';

const nameError = ref<string>('');

export function validateName(value: string): string {
  const valueTrim = value.trim();
  const errorMessageSpace = Errors.NameSpace;
  const errorMessage = Errors.NameFormat;
  const result = isName(value) ? '' : value === valueTrim ? errorMessage : errorMessageSpace;
  nameError.value = result;
  return result;
}
function isName(name: string): boolean {
  const regex = /^[A-Za-zЁА-яё]+$/;
  return regex.test(name);
}
