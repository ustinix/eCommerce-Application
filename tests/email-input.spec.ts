/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import EmailInput from '../src/components/layout/email-input.vue';

let wrapper: ReturnType<typeof mount>;
vi.mock('../src/stores/auth', () => ({
  useAuthStore: (): { setError: Mock } => ({
    setError: vi.fn(),
  }),
}));

describe('EmailInput.vue', () => {
  beforeEach(() => {
    wrapper = mount(EmailInput, {
      props: {
        modelValue: '',
        error: '',
        'onUpdate:modelValue': vi.fn(),
        'onUpdate:error': vi.fn(),
      },
    });
  });

  it('valid email — no error', async () => {
    const input = wrapper.get('input');
    await input.setValue('test@example.com');
    const events = wrapper.emitted() as Record<string, unknown[][]>;
    expect(events['update:error']?.[0][0]).toBeUndefined();
  });

  it('invalid email', async () => {
    const input = wrapper.get('input');
    await input.setValue('invalid_email');
    const events = wrapper.emitted() as Record<string, unknown[][]>;
    expect(events['update:error']?.[0][0]).toBe(
      'Email address must contain an "@" symbol, local part and domain name.',
    );
  });
  it('invalid email contain whitespace', async () => {
    const input = wrapper.get('input');
    await input.setValue(' invalid@email.com ');
    const events = wrapper.emitted() as Record<string, unknown[][]>;
    expect(events['update:error']?.[0][0]).toBe(
      'Email address must not contain leading or trailing whitespace',
    );
  });
});
