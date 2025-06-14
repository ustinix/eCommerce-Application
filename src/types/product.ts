import type { Image } from '@commercetools/platform-sdk';
import type { variantSize } from './variant-size';

export type ProductView = {
  name: string;
  description: string;
  price: number | null;
  priceDiscounted: number | null;
  images: Image[];
  categories?: Array<{ id: string }>;
  sizes: variantSize[];
};

export type ProductProjectoinView = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number | undefined;
  discountedPrice: number | undefined;
  hasDiscount: boolean;
  sizes: variantSize[];
};
