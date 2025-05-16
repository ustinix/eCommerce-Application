import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import Header from '../src/components/layout/header.vue';
//import { useAuthStore } from '@/stores/auth';
import { RouterLinkStub } from '@vue/test-utils';

// let wrapper: ReturnType<typeof mount>;
let isAuthenticated = false;
const setAuthMock = vi.fn();

vi.mock('../src/stores/auth', () => ({
  useAuthStore: (): { isAuthenticated: boolean; setAuth: Mock; setApiRoot: Mock } => ({
    isAuthenticated,
    setAuth: setAuthMock,
    setApiRoot: vi.fn(),
  }),
}));
beforeEach(() => {
  isAuthenticated = false;
  setAuthMock.mockClear();
});
describe('Header.vue', () => {
  it('shows Login and Registration links when not authenticated', () => {
    const wrapper = mount(Header, {
      global: {
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
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    await wrapper.find('button').trigger('click');
    expect(setAuthMock).toHaveBeenCalledWith(false);
  });
});
