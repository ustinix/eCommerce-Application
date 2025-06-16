import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CartPage from '../src/pages/cartPage/cart-page.vue';
import { sizeAttribute } from '../src/constants/constants';
import type { LineItem } from '@commercetools/platform-sdk';
import { createTestingPinia } from '@pinia/testing';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
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
    const wrapper = mount(CartPage, {
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
    });

    expect(wrapper.get('[data-testid="cart-message"]').text()).toBe('Your cart is empty');
  });
  it('shows a list of products if the cart is not empty', () => {
    const wrapper = mount(CartPage, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                cart: {
                  lineItems: [lineItem],
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
    });
    expect(wrapper.findComponent({ name: 'CartList' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'CartMessage' }).exists()).toBe(false);
  });
  it('disables the apply promo button when promoCode is empty', async () => {
    const wrapper = mount(CartPage, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                cart: {
                  lineItems: [lineItem],
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
    });
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.attributes('disabled')).toBeDefined();
    const input = wrapper.find('input');
    await input.setValue('PROMO2024');
    expect(button.attributes('disabled')).toBeUndefined();
  });
});
