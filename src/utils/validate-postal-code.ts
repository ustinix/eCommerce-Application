import { ref, type Ref } from 'vue';
import { Errors } from '../../src/assets/constants';

type PostalCodeValidation = {
  codeError: Ref<string>;
  validateCode: (value: string) => string;
};

const validatePostalCode = (value: string): string => {
  const regex = /^(?:\d{5,6}|[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d)$/;
  return regex.test(value) ? '' : Errors.PostalCodeFormat;
};

export function usePostalCodeValidation(disabledReference: Ref<boolean>): PostalCodeValidation {
  const codeError = ref('');

  const validateCode = (value: string): string => {
    if (disabledReference.value) return '';
    return validatePostalCode(value);
  };

  return {
    codeError,
    validateCode,
  };
}
