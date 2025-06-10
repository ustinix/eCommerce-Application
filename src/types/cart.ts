import type { Image } from '@commercetools/platform-sdk';
export type cartItem = {
  name: string;
  image: Image;
  price: number | null;
  quantity: number;
  sizes: string;
};
