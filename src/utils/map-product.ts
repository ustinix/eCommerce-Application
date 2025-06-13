import type { ProductData, Image } from '@commercetools/platform-sdk';
import type { ProductView } from '../types/product';
import { getSizes } from '../utils/get-sizes';

const placeholderImage = {
  url: 'http://dummyimage.com/400x400/99cccc.gif&text=the+image+disappeared!',
  dimensions: {
    w: 400,
    h: 400,
  },
};

export function mapProductDataToProductView(productData: ProductData): ProductView {
  const prefix = 'en-US';
  return {
    name: productData.name?.[prefix] ?? '',
    description: productData.description?.[prefix] ?? '',
    price: productData.masterVariant.prices?.[0]?.value?.centAmount || null,
    priceDiscounted: productData.masterVariant.prices?.[0]?.discounted?.value.centAmount || null,
    images: getImages(productData),
    categories: productData.categories,
    sizes: getSizes(productData),
  };
}
function getImages(productData: ProductData): Image[] {
  const images =
    productData && productData.masterVariant && productData.masterVariant.images
      ? productData.masterVariant.images
      : [];

  if (images.length === 0) {
    images.push(placeholderImage);
  }
  return images;
}
