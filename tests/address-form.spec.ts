import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AddressFormField from '../src/components/layout/address-form.vue';

describe('Street field', () => {
  it('empty street', async () => {
    const wrapper = mount(AddressFormField, {
      props: {
        label: 'Street',
        placeholder: 'Enter street',
        modelValue: '',
        fieldType: 'street',
        disabled: false,
      },
    });

    const input = wrapper.find('input');
    await input.setValue('');
    expect(wrapper.find('.form_error').text()).toBe('Street cannot be empty');
    expect(wrapper.find('.form_error.visible').exists()).toBe(true);
  });

  it('street with whitespace', async () => {
    const wrapper = mount(AddressFormField, {
      props: {
        label: 'Street',
        placeholder: 'Enter street',
        modelValue: '',
        fieldType: 'street',
        disabled: false,
      },
    });

    const input = wrapper.find('input');
    await input.setValue('  Main Street  ');
    expect(wrapper.find('.form_error').text()).toBe(
      'This field must not contain leading or trailing whitespace',
    );
    expect(wrapper.find('.form_error.visible').exists()).toBe(true);
  });

  it('accepts valid street', async () => {
    const wrapper = mount(AddressFormField, {
      props: {
        label: 'Street',
        placeholder: 'Enter street',
        modelValue: '',
        fieldType: 'street',
        disabled: false,
      },
    });

    const input = wrapper.find('input');
    await input.setValue('Main Street');
    expect(wrapper.find('.form_error.visible').exists()).toBe(false);
  });
});
