import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import type { PromoCode } from '../types/promo-code';
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
  cartStore.cart = response.body;
}

export async function applyPromoCode(
  authStore: ReturnType<typeof useAuthStore>,
  cartStore: ReturnType<typeof useCartStore>,
  promoCode: string,
): Promise<void> {
  if (cartStore.cart === null) {
    await getCart(authStore, cartStore);
  }
  if (cartStore.cart === null) return;
  const apiRoot = await authStore.currentApiRoot;
  try {
    const updatedCartResponse = await apiRoot
      .carts()
      .withId({ ID: cartStore.cart.id })
      .post({
        body: {
          version: cartStore.cart.version,
          actions: [
            {
              action: 'addDiscountCode',
              code: promoCode,
            },
          ],
        },
      })
      .execute();

    cartStore.cart = updatedCartResponse.body;
  } catch (error) {
    console.error('Failed to apply promo code:', error);
    throw new Error('Invalid or expired promo code');
  }
}

export async function removePromoCode(
  authStore: ReturnType<typeof useAuthStore>,
  cartStore: ReturnType<typeof useCartStore>,
  promoCodeId: string,
): Promise<void> {
  if (cartStore.cart === null) {
    await getCart(authStore, cartStore);
  }

  if (cartStore.cart === null) {
    throw new Error('Cart not found');
  }

  const apiRoot = await authStore.currentApiRoot;

  try {
    const updatedCartResponse = await apiRoot
      .carts()
      .withId({ ID: cartStore.cart.id })
      .post({
        body: {
          version: cartStore.cart.version,
          actions: [
            {
              action: 'removeDiscountCode',
              discountCode: {
                typeId: 'discount-code',
                id: promoCodeId,
              },
            },
          ],
        },
      })
      .execute();

    cartStore.cart = updatedCartResponse.body;
  } catch (error) {
    console.error('Failed to remove promo code:', error);
    throw new Error('Failed to remove promo code');
  }
}

export async function getDiscountCodeById(
  authStore: ReturnType<typeof useAuthStore>,
  discountCodeId: string,
): Promise<string> {
  try {
    const apiRoot = await authStore.currentApiRoot;

    const response = await apiRoot.discountCodes().withId({ ID: discountCodeId }).get().execute();

    return response.body.code;
  } catch (error) {
    console.error('Failed to fetch discount code details:', error);
    return '';
  }
}

export async function getDiscountCodes(
  authStore: ReturnType<typeof useAuthStore>,
): Promise<PromoCode[]> {
  try {
    const apiRoot = await authStore.currentApiRoot;

    const response = await apiRoot
      .discountCodes()
      .get({
        queryArgs: {
          expand: ['cartDiscounts[*].target', 'cartDiscounts[*].value'],
        },
      })
      .execute();
    return response.body.results.map(discountCode => {
      const mainDiscount = discountCode.cartDiscounts?.[0]?.obj;
      const discountValue = mainDiscount?.value;

      let discount = 0;
      if (discountValue?.type === 'relative') {
        discount = Math.round(discountValue.permyriad / 100);
      } else if (discountValue?.type === 'absolute') {
        discount = discountValue.money[0].centAmount / 100;
      }

      return {
        code: discountCode.code.trim(),
        discount,
        expires: discountCode.validUntil
          ? new Date(discountCode.validUntil).toLocaleDateString('ru-RU')
          : '31.12.2099',
        description: discountCode.description?.['en-US'] || 'No description',
      };
    });
  } catch (error) {
    console.error('Failed to fetch discount code details:', error);
    return [];
  }
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
