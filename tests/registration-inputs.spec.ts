import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RegistrationPage from '../src/pages/registrationPage/registration-page.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { Errors } from '../src/enums/errors';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock('../src/stores/auth', () => ({
  useAuthStore: (): { setError: Mock } => ({
    setError: vi.fn(),
  }),
}));

const vuetify = createVuetify({
  components,
  directives,
});

describe(' RegistrationPage inputs', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    setActivePinia(createPinia());

    wrapper = mount(RegistrationPage, {
      global: {
        plugins: [createPinia(), vuetify],
      },
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

  it('name validation', async () => {
    const input = wrapper.find('[data-test="name-input"] input');
    await input.setValue('Ann1');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.NameFormat);
    await input.setValue('Ann@');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.NameFormat);
    await input.setValue(' Ann ');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.NameSpace);
  });

  it('surname validation', async () => {
    const input = wrapper.find('[data-test="surname-input"] input');
    await input.setValue('Smitt1');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.SurnameFormat);
    await input.setValue('Smitt@');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.SurnameFormat);
    await input.setValue(' Smitt ');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.SurnameSpace);
  });

  it('date input validation', async () => {
    const input = wrapper.find('[data-test="date-input"] input');

    await input.setValue('2024-05-15');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.AgeError);

    await input.setValue('15/05/1990');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.DateFormat);

    await input.setValue('-05-1990');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.DateFormat);

    await input.setValue('');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.DateFormat);

    await input.setValue('30-02-2023');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.DateFormat);
  });

  it('PostalCode input validation', async () => {
    const input = wrapper.find('[data-test="PostalCode-input"] input');
    await input.setValue('12');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.PostalCodeFormat);
    await input.setValue('a1b 223');
    await flushPromises();
    expect(wrapper.html()).toContain(Errors.PostalCodeFormat);
  });
});
