import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SurnameInput from '../src/components/layout/surname-input.vue';

let wrapper: ReturnType<typeof mount>;

describe('FirstNameInput', () => {
  beforeEach(() => {
    wrapper = mount(SurnameInput, {
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
    await input.setValue('Smitt1');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe(
      'The surname must contain at least one character and no special characters or numbers.',
    );
  });

  it('name contains special characters', async () => {
    const input = wrapper.find('input');
    await input.setValue('Smitt@');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe(
      'The surname must contain at least one character and no special characters or numbers.',
    );
  });

  it('name contains space', async () => {
    const input = wrapper.find('input');
    await input.setValue(' Smitt ');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe('Surname must not contain leading or trailing whitespace.');
  });
});
