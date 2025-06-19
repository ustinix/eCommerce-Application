import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import Header from '../src/components/layout/header.vue';
import { RouterLinkStub } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

let isAuthenticated = false;
const logOutMock = vi.fn();

vi.mock('../src/stores/auth', () => ({
  useAuthStore: (): {
    isAuthenticated: boolean;
    setApiRoot: Mock;
    setUser: Mock;
    logOut: Mock;
  } => ({
    isAuthenticated,
    logOut: logOutMock,
    setApiRoot: vi.fn(),
    setUser: vi.fn(),
  }),
}));

vi.mock('../src/stores/user', () => ({
  useUserStore: () => ({
    setUserProfile: vi.fn(),
  }),
}));

vi.mock('../src/stores/cart', () => ({
  useCartStore: () => ({
    cart: null,
    cartId: '',
  }),
}));
beforeEach(() => {
  isAuthenticated = false;
  logOutMock.mockClear();
});
describe('Header.vue', () => {
  it('shows Login and Registration links when not authenticated', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    expect(wrapper.text()).toContain('Login');
    expect(wrapper.text()).toContain('Registration');
  });
  it('shows Logout button when authenticated', () => {
    isAuthenticated = true;
    const wrapper = mount(Header, {
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    expect(wrapper.find('button').text()).toBe('Logout');
  });
  it('calls logout function when Logout button is clicked', async () => {
    isAuthenticated = true;
    const wrapper = mount(Header, {
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    await wrapper.find('button').trigger('click');
    expect(logOutMock).toHaveBeenCalled();
  });
});
