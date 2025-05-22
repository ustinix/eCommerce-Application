import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginForm from '../src/components/layout/login-form.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { Errors } from '../src/assets/constants';

vi.mock('../src/stores/auth', () => ({
  useAuthStore: (): { setError: Mock } => ({
    setError: vi.fn(),
  }),
}));
const vuetify = createVuetify({
  components,
  directives,
});

let wrapper: ReturnType<typeof mount>;

describe('LoginForm.vue', () => {
  beforeEach(() => {
    wrapper = mount(LoginForm, {
      global: {
        plugins: [vuetify],
      },
    });
  });
  it('checks email correctly', async () => {
    const emailInput = wrapper.find('input[type="email"]');
    await emailInput.setValue('invalidemail');
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain(Errors.EmailSymbol);
    await emailInput.setValue('valid@email.ru');
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).not.toContain(Errors.EmailSymbol);
  });
});
