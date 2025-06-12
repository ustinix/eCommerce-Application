import type { ProductData, Image } from '@commercetools/platform-sdk';
import type { ProductView } from '../types/product';
import type { variantSize } from '../types/variant-size';
import { sizeAttribute } from '../constants/constants';

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

function getSizes(productData: ProductData): variantSize[] {
  const sizes: variantSize[] = productData.variants.map(variant => {
    const id = variant.id;
    const sizeAttributes = variant.attributes?.find(attribute => attribute.name === sizeAttribute);
    const value = sizeAttributes ? sizeAttributes.value[0].key : '';
    const sku = variant.sku ?? '';
    return { id, value: `${value}`, sku };
  });
  return sizes;
}
