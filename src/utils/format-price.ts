import { dollarSing } from '../constants/constants';

export const formatPrice = (price: number | undefined): string => {
  if (price !== undefined && price > 0) {
    return `${dollarSing}${(price / 100).toFixed(2)}`;
  }
  return '';
};
