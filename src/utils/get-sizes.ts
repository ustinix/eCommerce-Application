import type { ProductProjection } from '@commercetools/platform-sdk';
import type { ProductData } from '@commercetools/platform-sdk';

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
