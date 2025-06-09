import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Cart } from '@commercetools/platform-sdk';

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null);
  const cartId = ref<string>('');
  const anonymousId = ref<string | undefined>(undefined);
  const saved = localStorage.getItem('cartId');
  if (saved) {
    const parsed = JSON.parse(saved);
    cartId.value = parsed.cartId ?? '';
    anonymousId.value = parsed.anonymousId ?? undefined;
  }
  watch(
    [cartId, anonymousId],
    () => {
      localStorage.setItem(
        'cartId',
        JSON.stringify({
          cartId: cartId.value,
          anonymousId: anonymousId.value,
        }),
      );
    },
    { deep: true },
  );

  return {
    cart,
    cartId,
    anonymousId,
  };
});
