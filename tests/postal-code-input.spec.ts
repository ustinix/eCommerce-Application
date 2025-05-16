import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PostalCodeInput from '../src/components/layout/postal-code.vue';

let wrapper: ReturnType<typeof mount>;

describe('PostalCodeInput', () => {
  beforeEach(() => {
    wrapper = mount(PostalCodeInput, {
      props: {
        modelValue: '',
        error: '',
        'onUpdate:modelValue': (value: string | undefined) => {
          wrapper.setProps({ modelValue: value ?? '' });
        },
        'onUpdate:error': (value: string | undefined) => {
          wrapper.setProps({ error: value ?? '' });
        },
      },
    });
  });

  it('code common format', async () => {
    const input = wrapper.find('input');
    await input.setValue('12');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe(
      'The code must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively).',
    );
  });

  it('code U.S. format', async () => {
    const input = wrapper.find('input');
    await input.setValue('a1b 223');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe(
      'The code must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively).',
    );
  });
});
