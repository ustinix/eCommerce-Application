<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { countryCityList } from '../../assets/constants';
import { InputStar } from '../../assets/constants';
import { DropSign } from '../../assets/constants';

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
const inputValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});
</script>
<template>
  <div class="wrapper">
    <label class="form_label"
      >{{ label }} <span class="primary_color">{{ InputStar }}</span>
    </label>
    <input
      v-if="fieldType === 'street'"
      class="form_input"
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      required
    />

    <div v-else class="dropdown-container">
      <div
        class="dropdown-select"
        :class="{
          'dropdown-open': isDropdownOpen,
          'dropdown-disabled': fieldType === 'city' && !selectedCountry,
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
    }
  }
}
</style>
