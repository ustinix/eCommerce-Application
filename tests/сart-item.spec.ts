import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sizeAttribute } from '../src/constants/constants';
import type { LineItem } from '@commercetools/platform-sdk';
import CartItem from '../src/components/layout/cart-item.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

const removeProductMock = vi.fn();
const increaseProductMock = vi.fn();
const successMock = vi.fn();
const errorMock = vi.fn();

vi.mock('../src/services/cart-service', () => ({
  get removeProduct() {
    return removeProductMock;
  },
  get increaseQuantityProduct() {
    return increaseProductMock;
  },
}));

vi.mock('../src/stores/snackbar', () => ({
  useSnackbarStore: () => ({
    get success() {
      return successMock;
    },
    get error() {
      return errorMock;
    },
  }),
}));

vi.mock('../src/components/layout/snack-bar.vue', () => ({
  default: {
    name: 'Snackbar',
    template: '<div />',
  },
}));

const lineItem: LineItem = {
  id: '123',
  quantity: 2,
  name: { 'en-US': 'Test Product' },
  price: { value: { centAmount: 1000, currencyCode: 'USD' } },
  variant: {
    attributes: [{ name: sizeAttribute, value: [{ key: '37', label: '37 (EU)' }] }],
  },
} as unknown as LineItem;

describe('CartItem.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product info correctly', () => {
    const wrapper = mount(CartItem, {
      global: {
        plugins: [vuetify],
      },
      props: { lineItem },
    });
    expect(wrapper.text()).toContain('Test Product');
    expect(wrapper.text()).toContain('37 (EU)');
    expect(wrapper.text()).toContain('2');
  });

  it('calls increaseQuantityProduct when "+" clicked', async () => {
    const wrapper = mount(CartItem, {
      global: {
        plugins: [vuetify],
      },
      props: { lineItem },
    });
    const plusButton = wrapper.findAll('button').find(button => button.html().includes('mdi-plus'));
    await plusButton?.trigger('click');

    expect(increaseProductMock).toHaveBeenCalledWith('123', 3);
  });
  it('calls decreased quantity when "-" clicked', async () => {
    const wrapper = mount(CartItem, {
      global: {
        plugins: [vuetify],
      },
      props: { lineItem },
    });
    const minusButton = wrapper
      .findAll('button')
      .find(button => button.html().includes('mdi-minus'));
    await minusButton?.trigger('click');

    expect(removeProductMock).toHaveBeenCalledWith('123', 1);
  });
  it('calls remove', async () => {
    const wrapper = mount(CartItem, {
      global: {
        plugins: [vuetify],
      },
      props: { lineItem },
    });
    const deleteButton = wrapper
      .findAll('button')
      .find(button => button.html().includes('mdi-delete-outline'));
    await deleteButton?.trigger('click');

    expect(removeProductMock).toHaveBeenCalledWith('123', 2);
    expect(successMock).toHaveBeenCalledWith('The product has been permanently removed.');
  });
});
