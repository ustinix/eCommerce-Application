import type { useAuthStore } from '../stores/auth';
import type { useCartStore } from '../stores/cart';
import type { Cart } from '@commercetools/platform-sdk';

async function createAnonymousCart(
  authStore: ReturnType<typeof useAuthStore>,
  cartStore: ReturnType<typeof useCartStore>,
): Promise<Cart> {
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
  console.log('new anonym', cartResponse.body);
  cartStore.cartId = cartResponse.body.id;
  cartStore.anonymousId = cartResponse.body.anonymousId ?? undefined;
  return cartResponse.body;
}

async function createUserCart(authStore: ReturnType<typeof useAuthStore>): Promise<Cart> {
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

  return newCartResponse.body;
}

export async function addProductToCart(
  authStore: ReturnType<typeof useAuthStore>,
  cartStore: ReturnType<typeof useCartStore>,
  productId: string,
  variantId: number,
  quantity: number,
): Promise<void> {
  if (cartStore.cart === null) {
    await getCart(authStore, cartStore);
  }

  const d = {
    action: 'addLineItem',
    productId,
    variantId,
    quantity,
  };
  console.log('d', d);
  if (cartStore.cart === null) {
    console.log('нет корзины');
    return;
  }
  const updatedCartResponse = await authStore.currentApiRoot
    .carts()
    .withId({ ID: cartStore.cart.id })
    .post({
      body: {
        version: cartStore.cart.version,
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

  console.log('Товар добавлен в корзину:');
  console.log(updatedCartResponse.body.lineItems);
  cartStore.cart = updatedCartResponse.body;
  // return updatedCartResponse.body;
}
async function getCart(
  authStore: ReturnType<typeof useAuthStore>,
  cartStore: ReturnType<typeof useCartStore>,
): Promise<void> {
  cartStore.cart = authStore.isAuthenticated
    ? await getUserCart(authStore)
    : await getAnonymCart(authStore, cartStore);
}

async function getAnonymCart(
  authStore: ReturnType<typeof useAuthStore>,
  cartStore: ReturnType<typeof useCartStore>,
): Promise<Cart> {
  if (cartStore.cartId === '') return createAnonymousCart(authStore, cartStore);

  const cartResponse = await authStore.currentApiRoot
    .carts()
    .withId({ ID: cartStore.cartId })
    .get()
    .execute();
  return cartResponse.body;
}
async function getUserCart(authStore: ReturnType<typeof useAuthStore>): Promise<Cart> {
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
      ? await createUserCart(authStore)
      : cartResponse.body.results[0];
  return cart;
}
export async function associateCartToCustomer(
  authStore: ReturnType<typeof useAuthStore>,
  cart: Cart,
): Promise<Cart | undefined> {
  console.log('cart.customerId', cart.customerId);
  const customerResponse = await authStore.currentApiRoot.me().get().execute();
  const customerId = customerResponse.body.id;
  const userCarts = await authStore.currentApiRoot
    .me()
    .carts()
    .get({
      queryArgs: {
        where: 'cartState="Active"',
        sort: 'lastModifiedAt desc',
        limit: 1,
      },
    })
    .execute();
  console.log('userCarts.body.results', userCarts.body.results);
  if (userCarts.body.results[0]) {
    console.log('есть своя корзина', userCarts.body.results[0]);
    return;
  }
  const updatedCart = await authStore.currentApiRoot
    .carts()
    .withId({ ID: cart.id })
    .post({
      body: {
        version: cart.version,
        actions: [
          {
            action: 'setCustomerId',
            customerId: customerId,
          },
          {
            action: 'setAnonymousId',
            anonymousId: undefined,
          },
        ],
      },
    })
    .execute();
  console.log(' updatedCart.body', updatedCart.body);
  return updatedCart.body;
}
