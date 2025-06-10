import type { LineItem } from '@commercetools/platform-sdk';
import type { cartItem } from '../types/cart';

const placeholderImage = {
  url: 'http://dummyimage.com/400x400/99cccc.gif&text=the+image+disappeared!',
  dimensions: {
    w: 130,
    h: 130,
  },
};

export function mapCartItem(cartData: LineItem): cartItem {
  const prefix = 'en-US';
  const sizeAttribute = cartData.variant.attributes?.find(attribute => attribute.name === 'size');
  return {
    name: cartData.name?.[prefix] ?? '',
    price: cartData.price.value.centAmount || null,
    quantity: cartData.quantity,
    image: cartData.variant.images?.[0] ?? placeholderImage,
    sizes: sizeAttribute?.value ?? '',
  };
}
