import { dollarSing } from '../constants/constants';

export const formatPrice = (price: number | undefined): string => {
  if (!price) {
    return '';
  }
  return `${dollarSing}${(price / 100).toFixed(2)}`;
};
