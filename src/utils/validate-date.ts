import { ref } from 'vue';
import { Errors } from '../enums/errors';

const dateError = ref<string>('');

export function validateDate(value: string): string {
  const errorMessage = Errors.DateFormat;
  const ageError = Errors.AgeError;
  const result = isDate(value) ? (isAgeEnough(value, 13) ? '' : ageError) : errorMessage;

  dateError.value = result;
  return result;
}
function isDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}

function isAgeEnough(dateString: string, minAge: number): boolean {
  const birthDate = new Date(dateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= minAge;
}
