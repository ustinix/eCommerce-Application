import type { LineItem } from '@commercetools/platform-sdk';
import type { cartItem } from '../types/cart';

const placeholderImage = {
  url: 'http://dummyimage.com/130x130/99cccc.gif&text=the+image+disappeared!',
};

export function mapCartItem(cartData: LineItem): cartItem {
  const prefix = 'en-US';
  const sizeAttribute = cartData.variant.attributes?.find(attribute => attribute.name === 'size');
  return {
    id: cartData.id,
    name: cartData.name?.[prefix] ?? '',
    price: cartData.price.value.centAmount || 0,
    quantity: cartData.quantity || 1,
    imageUrl: cartData.variant.images?.[0]?.url ?? placeholderImage.url,
    sizes: sizeAttribute?.value ?? '',
  };
}
