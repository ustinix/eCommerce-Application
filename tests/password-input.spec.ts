import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import PasswordInput from '../src/components/layout/password-input.vue';

let wrapper: ReturnType<typeof mount>;
const errorMessage =
  'Password must contain at least 8 characters, uppercase and lowercase letter, number and special character';
vi.mock('../src/stores/auth', () => ({
  useAuthStore: (): { setError: Mock } => ({
    setError: vi.fn(),
  }),
}));

describe('PasswordInput.vue', () => {
  beforeEach(() => {
    wrapper = mount(PasswordInput, {
      props: {
        modelValue: '',
        error: '',
        'onUpdate:modelValue': vi.fn(),
        'onUpdate:error': vi.fn(),
      },
    });
  });

  it('valid password — no error', async () => {
    const input = wrapper.get('input');
    await input.setValue('Password123@');
    const events = wrapper.emitted('update:error');
    expect(events?.[0]?.[0]).toBeUndefined();
  });

  it('Password cannot be shorter than 8 characters', async () => {
    const input = wrapper.get('input');
    await input.setValue('aA@1');
    const events = wrapper.emitted('update:error');
    expect(events?.[0]?.[0]).toBe(errorMessage);
  });
  it('Password must contain a special character', async () => {
    const input = wrapper.get('input');
    await input.setValue('aA1234567');
    const events = wrapper.emitted('update:error');
    expect(events?.[0]?.[0]).toBe(errorMessage);
  });
  it('Password must contain a capital letter', async () => {
    const input = wrapper.get('input');
    await input.setValue('a@1234567');
    const events = wrapper.emitted('update:error');
    expect(events?.[0]?.[0]).toBe(errorMessage);
  });
  it('Password must contain a number', async () => {
    const input = wrapper.get('input');
    await input.setValue('a@Asdfrtght');
    const events = wrapper.emitted('update:error');
    expect(events?.[0]?.[0]).toBe(errorMessage);
  });
});
