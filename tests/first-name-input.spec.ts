import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FirstNameInput from '../src/components/layout/first-name-input.vue';

let wrapper: ReturnType<typeof mount>;

describe('FirstNameInput', () => {
  beforeEach(() => {
    wrapper = mount(FirstNameInput, {
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

  it('name contains number', async () => {
    const input = wrapper.find('input');
    await input.setValue('Ann1');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe(
      'The name must contain at least one character and no special characters or numbers.',
    );
  });

  it('name contains special characters', async () => {
    const input = wrapper.find('input');
    await input.setValue('Ann@');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe(
      'The name must contain at least one character and no special characters or numbers.',
    );
  });

  it('name contains space', async () => {
    const input = wrapper.find('input');
    await input.setValue(' Ann ');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe('Name must not contain leading or trailing whitespace');
  });
});
