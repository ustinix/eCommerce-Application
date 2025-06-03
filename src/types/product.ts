import type { Image } from '@commercetools/platform-sdk';

export type ProductView = {
  name: string;
  description: string;
  price: number | null;
  priceDiscounted: number | null;
  images: Image[];
};
