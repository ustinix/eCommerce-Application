/* eslint-disable @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-empty-function */
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CartPage from '../src/pages/cartPage/cart-page.vue';
import { sizeAttribute } from '../src/constants/constants';
import type { LineItem } from '@commercetools/platform-sdk';
import { createTestingPinia } from '@pinia/testing';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VApp } from 'vuetify/components';

const vuetify = createVuetify({
  components,
  directives,
});
// --- Мок ResizeObserver ---
/* eslint-disable class-methods-use-this */
class ResizeObserver {
  public observe(): void {}
  public unobserve(): void {}
  public disconnect(): void {}
}
globalThis.ResizeObserver = ResizeObserver;

const lineItem: LineItem = {
  id: '123',
  quantity: 2,
  name: { 'en-US': 'Test Product' },
  price: { value: { centAmount: 1000, currencyCode: 'USD' } },
  variant: {
    attributes: [{ name: sizeAttribute, value: [{ key: '37', label: '37 (EU)' }] }],
  },
} as unknown as LineItem;

describe('CartPage.vue', () => {
  it('shows CartMessage when cart is empty', async () => {
    const wrapper = mount(
      {
        template: '<v-app><CartPage /></v-app>',
        components: { CartPage, VApp },
      },
      {
        global: {
          plugins: [
            vuetify,
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                cart: {
                  cart: {
                    lineItems: [],
                  },
                },
                auth: {},
                snackbar: {},
              },
            }),
          ],

          stubs: {
            Snackbar: true,
            CartList: true,
            CartMessage: {
              template: '<div data-testid="cart-message">Your cart is empty</div>',
            },
          },
        },
      },
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.get('[data-testid="cart-message"]').text()).toBe('Your cart is empty');
  });
  it('shows a list of products if the cart is not empty', async () => {
    const wrapper = mount(
      {
        template: '<v-app><CartPage /></v-app>',
        components: { CartPage, VApp },
      },
      {
        global: {
          plugins: [
            vuetify,
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                cart: {
                  cart: {
                    lineItems: [lineItem],
                    discountCodes: [{ discountCode: { id: 'test-discount' } }],
                    discountOnTotalPrice: {
                      discountedAmount: { centAmount: 1000 },
                    },
                    totalPrice: { centAmount: 5000 },
                  },
                },
                auth: {},
                snackbar: {},
              },
            }),
          ],
          stubs: {
            Snackbar: true,
            CartMessage: true,
          },
        },
      },
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'CartList' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'CartMessage' }).exists()).toBe(false);
  });
  it('disables the apply promo button when promoCode is empty', async () => {
    const wrapper = mount(
      {
        template: '<v-app><CartPage /></v-app>',
        components: { CartPage, VApp },
      },
      {
        global: {
          plugins: [
            vuetify,
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                cart: {
                  cart: {
                    lineItems: [lineItem],
                    discountCodes: [{ discountCode: { id: 'test-discount' } }],
                    discountOnTotalPrice: {
                      discountedAmount: { centAmount: 1000 },
                    },
                    totalPrice: { centAmount: 5000 },
                  },
                },
                auth: {},
                snackbar: {},
              },
            }),
          ],
          stubs: {
            Snackbar: true,
            CartList: true,
            CartMessage: true,
          },
        },
      },
    );
    await wrapper.vm.$nextTick();
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.attributes('disabled')).toBeDefined();
    const input = wrapper.find('input');
    await input.setValue('PROMO2024');
    expect(button.attributes('disabled')).toBeUndefined();
  });
  it('show subtotal and discount when promoCode is applied', async () => {
    const wrapper = mount(
      {
        template: '<v-app><CartPage /></v-app>',
        components: { CartPage, VApp },
      },
      {
        global: {
          plugins: [
            vuetify,
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                cart: {
                  cart: {
                    lineItems: [lineItem],
                    discountCodes: [{ discountCode: { id: 'test-discount' } }],
                    discountOnTotalPrice: {
                      discountedAmount: { centAmount: 1000 },
                    },
                    totalPrice: { centAmount: 500 },
                  },
                },
                auth: {},
                snackbar: {},
              },
            }),
          ],
          stubs: {
            Snackbar: true,
            CartList: true,
            CartMessage: true,
          },
        },
      },
    );
    await wrapper.vm.$nextTick();
    const discountCard = wrapper.find('[data-test="discount-card"]');
    expect(discountCard.exists()).toBe(true);
    expect(discountCard.text()).toContain('Subtotal:');
    expect(discountCard.text()).toContain('$20.00');
    expect(discountCard.text()).toContain('Discount');
    expect(discountCard.text()).toContain('-$15.00');
  });
});
