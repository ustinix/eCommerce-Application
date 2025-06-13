import type { ProductProjection } from '@commercetools/platform-sdk';
import type { ProductData } from '@commercetools/platform-sdk';
import type { variantSize } from '../types/variant-size';
import { sizeAttribute } from '../constants/constants';

export function getAllSizes(product: ProductProjection | ProductData): string[] {
  const allVariants = [product.masterVariant, ...product.variants];

  const uniqueSizeKeys = new Set<string>();

  for (const variant of allVariants) {
    const sizeAttribute = variant.attributes?.find(attribute => attribute.name === 'shoeSize');

    if (sizeAttribute?.value && Array.isArray(sizeAttribute.value)) {
      for (const sizeObject of sizeAttribute.value) {
        if (sizeObject?.key) {
          uniqueSizeKeys.add(String(sizeObject.key));
        }
      }
    }
  }

  return [...uniqueSizeKeys].sort((a, b) => a.localeCompare(b));
}
export function getSizes(productData: ProductProjection | ProductData): variantSize[] {
  const sizes: variantSize[] = productData.variants.map(variant => {
    const id = variant.id;
    const sizeAttributes = variant.attributes?.find(attribute => attribute.name === sizeAttribute);
    const value = sizeAttributes ? sizeAttributes.value[0].key : '';
    const sku = variant.sku ?? '';
    return { id, value: `${value}`, sku };
  });
  return sizes;
}
