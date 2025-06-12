import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import type { Cart, MyCartUpdateAction } from '@commercetools/platform-sdk';

async function createAnonymousCart(
  authStore: ReturnType<typeof useAuthStore>,
  cartStore: ReturnType<typeof useCartStore>,
): Promise<Cart> {
  const apiRoot = await authStore.currentApiRoot;
  const cartResponse = await apiRoot
    .me()
    .carts()
    .post({
      body: {
        currency: 'USD',
        country: 'US',
      },
    })
    .execute();
  cartStore.cartId = cartResponse.body.id;
  cartStore.anonymousId = cartResponse.body.anonymousId ?? undefined;
  return cartResponse.body;
}
async function createUserCart(authStore: ReturnType<typeof useAuthStore>): Promise<Cart> {
  const apiRoot = await authStore.currentApiRoot;
  const newCartResponse = await apiRoot
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
  quantity = 1,
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
    return;
  }
  const apiRoot = await authStore.currentApiRoot;

  const updatedCartResponse = await apiRoot
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
}
export async function getCart(
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
  const apiRoot = await authStore.currentApiRoot;
  const cartResponse = await apiRoot
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
async function changeCart(actions: MyCartUpdateAction[]): Promise<void> {
  const authStore = useAuthStore();
  const cartStore = useCartStore();
  if (cartStore.cart === null) return;
  const apiRoot = await authStore.currentApiRoot;
  const response = await apiRoot
    .me()
    .carts()
    .withId({ ID: cartStore.cart.id })
    .post({
      body: {
        version: cartStore.cart.version,
        actions,
      },
    })
    .execute();
  console.log('newcar', response.body);
  cartStore.cart = response.body;
}

export async function removeProduct(id: string, quantity: number): Promise<void> {
  const actions: MyCartUpdateAction[] = [
    {
      action: 'removeLineItem',
      lineItemId: id,
      quantity,
    },
  ];
  changeCart(actions);
}
export async function increaseQuantityProduct(id: string, newQuantity: number): Promise<void> {
  const actions: MyCartUpdateAction[] = [
    {
      action: 'changeLineItemQuantity',
      lineItemId: id,
      quantity: newQuantity,
    },
  ];
  changeCart(actions);
}

export async function clearCart(): Promise<void> {
  const cartStore = useCartStore();
  if (cartStore.cart === null) return;
  const actions: MyCartUpdateAction[] = cartStore.cart.lineItems.map(item => {
    return { action: 'removeLineItem', lineItemId: item.id };
  });
  changeCart(actions);
}
