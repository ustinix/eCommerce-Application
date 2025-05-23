import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import LoginForm from '../src/components/layout/login-form.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { RouterLinkStub } from '@vue/test-utils';

const errorPassword =
  'Password must contain at least 8 characters, uppercase and lowercase letter, number and special character';
const errorEmail = 'must contain an "@" symbol';
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
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
  });
  it('checks email correctly', async () => {
    const emailInput = wrapper.find('input[type="email"]');
    await emailInput.setValue('invalidemail');
    expect(wrapper.html()).toContain(errorEmail);
    await emailInput.setValue('valid@email.ru');
    await flushPromises();
    expect(wrapper.html()).not.toContain(errorEmail);
  });
  it('valid password — no error', async () => {
    const input = wrapper.find('input[type="password"]');
    await input.setValue('Password123@');
    await flushPromises();
    expect(wrapper.html()).not.toContain(errorPassword);
  });

  it('Password cannot be shorter than 8 characters', async () => {
    const input = wrapper.find('input[type="password"]');
    await input.setValue('aA@1');
    await flushPromises();
    expect(wrapper.html()).toContain(errorPassword);
  });
  it('Password must contain a special character', async () => {
    const input = wrapper.find('input[type="password"]');
    await input.setValue('aA1234567');
    await flushPromises();
    expect(wrapper.html()).toContain(errorPassword);
  });
  it('Password must contain a capital letter', async () => {
    const input = wrapper.find('input[type="password"]');
    await input.setValue('a@1234567');
    await flushPromises();
    expect(wrapper.html()).toContain(errorPassword);
  });
  it('Password must contain a number', async () => {
    const input = wrapper.find('input[type="password"]');
    await input.setValue('a@Asdfrtght');
    await flushPromises();
    expect(wrapper.html()).toContain(errorPassword);
  });
  it('button is disabled when fields are empty', async () => {
    const loginButton = wrapper.find('button.form_button')?.element as HTMLButtonElement;
    expect(loginButton.disabled).toBe(true);
  });
  it('the button is active if your email and password are valid', async () => {
    const inputEmail = wrapper.find('input[type="password"]');
    await inputEmail.setValue('user@rr.ru');
    const inputPassword = wrapper.find('input[type="password"]');
    await inputPassword.setValue('Password123@');
    const loginButton = wrapper.find('button.form_button')?.element as HTMLButtonElement;
    expect(loginButton.disabled).toBe(true);
  });
});
