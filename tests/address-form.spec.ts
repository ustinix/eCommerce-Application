import { describe, it, expect, beforeEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import AddressForm from '../src/components/layout/address-form.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { Errors } from '../src/enums/errors';

const vuetify = createVuetify({
  components,
  directives,
});

describe('Address form - street input', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(AddressForm, {
      global: {
        plugins: [vuetify],
      },
      props: {
        label: 'Street',
        placeholder: 'Enter your street',
        modelValue: '',
        fieldType: 'street',
        disabled: false,
      },
    });
  });
  it('empty street', async () => {
    const baseInput = wrapper.findComponent({ name: 'BaseInput' });
    await baseInput.setValue('');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.Street);
  });

  it('whitespace-only string', async () => {
    const baseInput = wrapper.findComponent({ name: 'BaseInput' });
    await baseInput.setValue('   ');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.Street);
  });

  it('leading/trailing spaces', async () => {
    const baseInput = wrapper.findComponent({ name: 'BaseInput' });
    await baseInput.setValue('  Main Street  ');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.Common);
  });

  it('valid street name', async () => {
    const baseInput = wrapper.findComponent({ name: 'BaseInput' });
    await baseInput.setValue('Main Street');
    await flushPromises();
    expect(wrapper.html()).not.toContain(Errors.Street);
    expect(wrapper.html()).not.toContain(Errors.Common);
  });
});
