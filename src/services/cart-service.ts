import type { useAuthStore } from '../stores/auth';
import type { Cart } from '@commercetools/platform-sdk';

async function createAnonymousCart(authStore: ReturnType<typeof useAuthStore>): Promise<Cart> {
  const apiRoot = await authStore.currentApiRoot;
  const cartResponse = await apiRoot
    .carts()
    .post({
      body: {
        currency: 'USD',
        country: 'US',
      },
    })
    .execute();
  console.log('anonym', cartResponse.body);
  authStore.savedCartId = cartResponse.body.id;
  return cartResponse.body;
}

async function createCart(authStore: ReturnType<typeof useAuthStore>): Promise<Cart> {
  const newCartResponse = await authStore.currentApiRoot
    .me()
    .carts()
    .post({
      body: {
        currency: 'USD',
        country: 'US',
      },
    })
    .execute();

  console.log('cart', newCartResponse.body);
  return newCartResponse.body;
}

export async function addProductToCart(
  authStore: ReturnType<typeof useAuthStore>,
  productId: string,
  variantId: number,
  quantity: number,
): Promise<Cart | null> {
  const cart: Cart = authStore.isAuthenticated
    ? await getCart(authStore)
    : await getAnonymCart(authStore);

  const d = {
    action: 'addLineItem',
    productId,
    variantId,
    quantity,
  };
  console.log('d', d);
  const updatedCartResponse = await authStore.currentApiRoot
    .carts()
    .withId({ ID: cart.id })
    .post({
      body: {
        version: cart.version,
        actions: [
          {
            action: 'addLineItem',
            productId,
            variantId,
            quantity,
          },
        ],
      },
    })
    .execute();

  console.log('✅ Товар добавлен в корзину:');
  console.log(updatedCartResponse.body.lineItems);

  return updatedCartResponse.body;
}
async function getAnonymCart(authStore: ReturnType<typeof useAuthStore>): Promise<Cart> {
  if (authStore.savedCartId === '') return createAnonymousCart(authStore);
  console.log('ddd', authStore.currentApiRoot);
  const cartResponse = await authStore.currentApiRoot
    .carts()
    .withId({ ID: authStore.savedCartId })
    .get()
    .execute();
  return cartResponse.body;
}
async function getCart(authStore: ReturnType<typeof useAuthStore>): Promise<Cart> {
  const cartResponse = await authStore.currentApiRoot
    .me()
    .carts()
    .get({
      queryArgs: {
        where: 'cartState="Active"',
        limit: 1,
        sort: 'lastModifiedAt desc',
      },
    })
    .execute();
  const cart =
    !cartResponse || !cartResponse.body || cartResponse.body.results.length === 0
      ? await createCart(authStore)
      : cartResponse.body.results[0];
  return cart;
}
