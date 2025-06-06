<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { categoriesId } from '../../constants/constants';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  modelValue?: string[];
  currentCategory?: string | null;
  withRouting?: boolean;
}>();

const emit = defineEmits<{
  (error: 'update:modelValue', value: string[]): void;
  (error: 'change', categoryId: string | null): void;
}>();

const availableCategories = categoriesId.map(cat => ({
  name: cat.name,
  id: cat.id,
}));

const activeCategory = ref<string | null>(props.currentCategory || props.modelValue?.[0] || null);

const selectCategory = (categoryId: string): void => {
  if (activeCategory.value === categoryId) {
    activeCategory.value = null;
    emit('update:modelValue', []);
    emit('change', null);
    if (props.withRouting) {
      router.push({ path: '/catalog' });
    }
    return;
  }

  activeCategory.value = categoryId;
  emit('update:modelValue', [categoryId]);
  emit('change', categoryId);

  if (props.withRouting) {
    router.push({
      path: '/catalog',
      query: { category: categoryId },
    });
  }
};

watch(
  () => props.modelValue,
  newValue => {
    if (!newValue || newValue.length === 0) {
      activeCategory.value = null;
    } else if (newValue[0] !== activeCategory.value) {
      activeCategory.value = newValue[0];
    }
  },
);

watch(
  () => props.currentCategory,
  newValue => {
    activeCategory.value = newValue || null;
  },
);

const vuetifyColorRed = 'primary';
const vuetifyColorGray = 'grey-lighten-2';
function checkIsActive(id: string): boolean {
  return activeCategory.value === id;
}

function getButtonColorById(id: string): string {
  return checkIsActive(id) ? vuetifyColorRed : vuetifyColorGray;
}

const isActive = computed(() => checkIsActive);
const getButtonColor = computed(() => getButtonColorById);
</script>

<template>
  <div class="category-buttons d-flex flex-wrap ga-3">
    <v-btn
      v-for="category in availableCategories"
      :key="category.id"
      :color="getButtonColor(category.id)"
      size="x-large"
      @click="selectCategory(category.id)"
      class="category-btn px-4"
      :class="{ 'active-category': isActive(category.id) }"
    >
      {{ category.name }}
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.category-buttons {
  margin: 12px 0;
  justify-content: center;
}

.category-btn {
  transition: all 0.3s ease;
  min-width: 140px;
}

.active-category {
  font-weight: bold;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px v.$color-placeholder;
}

@media (max-width: 600px) {
  .category-btn {
    min-width: 120px;
    font-size: 0.875rem;
    padding: 0 8px;
  }
}
</style>
