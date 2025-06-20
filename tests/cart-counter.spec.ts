import { mount, RouterLinkStub } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { sizeAttribute } from '../src/constants/constants';
import type { LineItem } from '@commercetools/platform-sdk';
import { createTestingPinia } from '@pinia/testing';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import Header from '../src/components/layout/header.vue';

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

describe('Header.vue', () => {
  it('show counter when cart is not empty', async () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cart: {
                cart: {
                  totalItems: 2,
                  lineItems: [lineItem],
                },
              },
              auth: {},
            },
          }),
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    const counter = wrapper.find('[data-test="cart-counter"]');
    expect(counter.exists()).toBe(true);
    expect(counter.text()).toBe('2');
  });
});
