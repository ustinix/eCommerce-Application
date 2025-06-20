import { dollarSign } from '../constants/constants';

export const formatPrice = (price: number | undefined): string => {
  if (price !== undefined && price > 0) {
    return `${dollarSign}${(price / 100).toFixed(2)}`;
  }
  return '';
};
