<script setup lang="ts">
import { computed, ref } from 'vue';
import { countryCityList } from '../../assets/constants';

type defineProps = {
  label: string;
  placeholder: string;
  modelValue: string;
  fieldType: 'street' | 'city' | 'country';
  disabled: boolean;
  selectedCountry?: string;
};

const props = withDefaults(defineProps<defineProps>(), {
  fieldType: 'street',
  disabled: false,
  selectedCountry: '',
});

const emit = defineEmits(['update:modelValue', 'update:selectedCountry']);

const error = ref('');
const isDropdownOpen = ref(false);

const countries = computed(() => Object.keys(countryCityList));
const cities = computed(() => {
  if (!props.selectedCountry || !isCountry(props.selectedCountry)) return [];
  return countryCityList[props.selectedCountry];
});

function validate(value: string): void {
  const valueTrim = value.trim();

  if (value && value !== valueTrim) {
    error.value = 'This field must not contain leading or trailing whitespace';
    return;
  }

  emit('update:modelValue', value);

  switch (props.fieldType) {
    case 'street': {
      error.value = value ? '' : 'Street cannot be empty';
      break;
    }
    case 'city': {
      if (!props.selectedCountry) {
        error.value = 'Please select country first';
      } else if (!value) {
        error.value = 'City cannot be empty';
      } else if (isValidCity(props.selectedCountry, value)) {
        error.value = 'Invalid city for selected country';
      } else {
        error.value = '';
      }
      break;
    }
    case 'country': {
      if (value) {
        if (isCountry(value)) {
          error.value = '';
          emit('update:selectedCountry', value);
        } else {
          error.value = 'Please select a valid country';
        }
      } else {
        error.value = 'Country cannot be empty';
      }
      break;
    }
  }
}

function isCountry(value: string): boolean {
  return value in countryCityList;
}

function isValidCity(country: string, city: string): boolean {
  return isCountry(country) && countryCityList[country].includes(city);
}
function selectOption(value: string): void {
  validate(value);
  isDropdownOpen.value = false;
}
function toggleDropdown(): void {
  if (props.disabled || (props.fieldType === 'city' && !props.selectedCountry)) return;
  isDropdownOpen.value = !isDropdownOpen.value;
}
</script>
<template>
  <div class="wrapper">
    <label class="form_label">{{ label }} <span class="primary_color">*</span> </label>
    <input
      v-if="fieldType === 'street'"
      class="form_input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="validate(($event.target as HTMLInputElement).value)"
      :disabled="disabled"
      required
    />

    <div v-else class="dropdown-container">
      <div
        class="dropdown-select"
        :class="{
          'dropdown-open': isDropdownOpen,
          'dropdown-disabled': disabled || (fieldType === 'city' && !selectedCountry),
        }"
        @click="toggleDropdown"
      >
        <span v-if="modelValue">{{ modelValue }}</span>
        <span v-else class="placeholder">{{ placeholder }}</span>
        <span class="dropdown-arrow">▼</span>
      </div>

      <ul v-if="isDropdownOpen" class="dropdown-options">
        <li
          v-for="item in fieldType === 'country' ? countries : cities"
          :key="item"
          @click="selectOption(item)"
          :class="{ selected: item === modelValue }"
        >
          {{ item }}
        </li>
        <li
          v-if="
            (fieldType === 'country' && countries.length === 0) ||
            (fieldType === 'city' && cities.length === 0)
          "
          class="no-options"
        >
          No options available
        </li>
      </ul>
    </div>
    <p class="form_error" :class="{ visible: !!error }">{{ error }}</p>
  </div>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
.wrapper {
  display: flex;
  flex-direction: column;
  .dropdown-container {
    position: relative;
    width: 100%;
  }

  .dropdown-select {
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 12px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .placeholder {
      color: #999;
    }

    .dropdown-arrow {
      font-size: 0.8rem;
    }
  }

  .dropdown-disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    border: 1px solid #ccc;
    border-top: none;
    background-color: white;
    z-index: 100;
    list-style: none;

    li {
      padding: 0.5rem;
      cursor: pointer;

      &:hover {
        background-color: #f0f0f0;
      }

      &.selected {
        background-color: #e0e0e0;
        font-weight: bold;
      }

      &.no-options {
        color: #999;
        cursor: default;
        &:hover {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
