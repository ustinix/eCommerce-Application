import { describe, it, expect } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import BaseInput from '../src/components/layout/base-input.vue';

const requiredText = '*';
const validate = (value: string): string => (value.length < 3 ? 'short' : '');

const vuetify = createVuetify({
  components,
  directives,
});

describe('BaseInput.vue', () => {
  it('displays a check mark for a required field', () => {
    const wrapper = mount(BaseInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        modelValue: '',
        label: 'Test',
        required: true,
      },
    });
    expect(wrapper.text()).toContain(requiredText);
  });

  it('displays an error when the input is invalid', async () => {
    const wrapper = mount(BaseInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        modelValue: '',
        label: 'Text',
        validate,
      },
    });
    const input = wrapper.find('input');
    await input.setValue('ab');

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('short');
  });
  it('switches the password type', async () => {
    const wrapper = mount(BaseInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        modelValue: '',
        label: 'password',
        type: 'password',
      },
    });

    const icon = wrapper.find('[role="button"]');
    const input = wrapper.find('input');
    expect(input.attributes('type')).toBe('password');

    await icon.trigger('click');
    await flushPromises();
    expect(input.attributes('type')).toBe('text');
  });
  it('applies class to type date', () => {
    const wrapper = mount(BaseInput, {
      global: {
        plugins: [vuetify],
      },
      props: {
        modelValue: '',
        label: 'date',
        type: 'date',
      },
    });
    expect(wrapper.find('.form_input').classes()).toContain('date-input');
  });
});
