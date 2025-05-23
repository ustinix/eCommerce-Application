<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { countryCityList } from '../../assets/constants';
import { InputStar } from '../../assets/constants';
import { DropSign } from '../../assets/constants';
import BaseInput from './base-input.vue';
import validateStreet from '../../utils/validate-street';

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
  selectedCountry: '',
});

const emit = defineEmits(['update:modelValue', 'update:selectedCountry']);

const error = ref('');
const isDropdownOpen = ref(false);

const countries = computed(() => Object.keys(countryCityList));
const cities = computed(() => {
  if (!props.selectedCountry) return [];
  return countryCityList[props.selectedCountry].cities;
});

const dropdownItems = computed(() => {
  return props.fieldType === 'country' ? countries.value : cities.value;
});

watch(
  () => props.selectedCountry,
  (newCountry, oldCountry) => {
    if (newCountry !== oldCountry && props.fieldType === 'city') {
      emit('update:modelValue', '');
    }
  },
);

function selectOption(value: string): void {
  emit('update:modelValue', value);
  if (props.fieldType === 'country') {
    emit('update:selectedCountry', value);
  }
  isDropdownOpen.value = false;
}
function toggleDropdown(): void {
  if (props.disabled || (props.fieldType === 'city' && !props.selectedCountry)) return;
  isDropdownOpen.value = !isDropdownOpen.value;
}
function handleStreetInput(value: string): void {
  emit('update:modelValue', value);
  error.value = validateStreet(value);
}
</script>
<template>
  <div class="wrapper">
    <template v-if="fieldType !== 'street'">
      <label class="form_label">
        {{ label }} <span class="required-star">{{ InputStar }}</span>
      </label>

      <div class="dropdown-container">
        <div
          class="dropdown-select"
          :class="{
            'dropdown-open': isDropdownOpen,
            'dropdown-disabled': props.disabled || (fieldType === 'city' && !selectedCountry),
          }"
          @click="toggleDropdown"
        >
          <span v-if="modelValue">{{ modelValue }}</span>
          <span v-else class="placeholder">{{ placeholder }}</span>
          <span class="dropdown-arrow">{{ DropSign }}</span>
        </div>

        <ul v-if="isDropdownOpen" class="dropdown-options">
          <li
            v-for="item in dropdownItems"
            :key="item"
            @click="selectOption(item)"
            :class="{ selected: item === modelValue }"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </template>

    <BaseInput
      v-if="fieldType === 'street'"
      :model-value="modelValue"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :validate="validateStreet"
      required
      @update:model-value="handleStreetInput"
    />

    <p v-if="error" class="form_error">{{ error }}</p>
  </div>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
@use '../../assets/styles/variables.scss' as v;
.wrapper {
  display: flex;
  flex-direction: column;
  .dropdown-container {
    margin-bottom: 30px;
    position: relative;
    width: 100%;
    border-radius: 5px;
  }

  .dropdown-select {
    padding: 0.5rem;
    border: 1px solid v.$color-border;
    border-radius: 5px;
    background-color: v.$color-white;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .placeholder {
      color: v.$color-placeholder;
    }

    .dropdown-arrow {
      font-size: 0.8rem;
    }
  }

  .dropdown-disabled {
    background-color: v.$color-disabled;
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
    border: 1px solid v.$color-border;
    border-radius: 5px;
    border-top: none;
    background-color: v.$color-white;
    z-index: 100;
    list-style: none;

    li {
      padding: 0.5rem;
      cursor: pointer;

      &:hover {
        background-color: v.$color-lightgray;
      }

      &.selected {
        background-color: v.$color-selected;
        font-weight: bold;
      }
    }
  }
}
</style>
