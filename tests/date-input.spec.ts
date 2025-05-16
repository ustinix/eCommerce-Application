import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DateInput from '../src/components/layout/date-input.vue';

let wrapper: ReturnType<typeof mount>;

describe('DateInput', () => {
  beforeEach(() => {
    wrapper = mount(DateInput, {
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

  it('age less than 13 years', async () => {
    const input = wrapper.find('input');
    await input.setValue('2024-05-15');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe('You must be at least 13 years old.');
  });

  it('wrong date format', async () => {
    const input = wrapper.find('input');
    await input.setValue('15/05/1990');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe('The date must be in the YYYY-MM-DD format.');
  });

  it('not full date', async () => {
    const input = wrapper.find('input');
    await input.setValue('-05-1990');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe('The date must be in the YYYY-MM-DD format.');
  });

  it('empty date', async () => {
    const input = wrapper.find('input');
    await input.setValue('');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe('The date must be in the YYYY-MM-DD format.');
  });

  it('not real date', async () => {
    const input = wrapper.find('input');
    await input.setValue('30-02-2023');

    const emitted = wrapper.emitted('update:error');
    expect(emitted?.[0]?.[0]).toBe('The date must be in the YYYY-MM-DD format.');
  });
});
