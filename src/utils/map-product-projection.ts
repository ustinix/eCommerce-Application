import type { ProductProjection } from '@commercetools/platform-sdk';
import { getSizes } from '../utils/get-sizes';

const placeholderImage = {
  url: 'https://via.placeholder.com/296x400',
  dimensions: { w: 296, h: 400 },
};

export function mapProductProjection(product: ProductProjection) {
  const prefix = 'en-US';
  const masterVariant = product.masterVariant;

  return {
    id: product.id,
    name: product.name?.[prefix] ?? '',
    description: product.description?.[prefix] ?? '',
    image: masterVariant.images?.[0]?.url ?? placeholderImage.url,
    price: masterVariant.prices?.[0]?.value?.centAmount,
    discountedPrice: masterVariant.prices?.[0]?.discounted?.value.centAmount,
    hasDiscount: !!masterVariant.prices?.[0]?.discounted,
    // sizes: getAllSizes(product),
    sizes: getSizes(product),
  };
}
