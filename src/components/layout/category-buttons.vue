<script setup lang="ts">
import { computed } from 'vue';
import { categoriesId, COLORS } from '../../constants/constants';
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

const availableCategories = computed(() =>
  categoriesId.map(category => ({
    name: category.name,
    id: category.id,
    isActive: activeCategory.value === category.id,
    color: activeCategory.value === category.id ? COLORS.ACTIVE : COLORS.INACTIVE,
  })),
);

const activeCategory = computed({
  get() {
    return props.currentCategory || props.modelValue?.[0] || null;
  },
  set(value: string | null) {
    if (value === activeCategory.value) {
      handleCategoryChange(null);
    } else {
      handleCategoryChange(value);
    }
  },
});

const handleCategoryChange = (categoryId: string | null): void => {
  emit('update:modelValue', categoryId ? [categoryId] : []);
  emit('change', categoryId);

  if (props.withRouting) {
    updateRoute(categoryId);
  }
};

const updateRoute = (categoryId: string | null): void => {
  if (categoryId) {
    router.push({
      path: '/catalog',
      query: { category: categoryId },
    });
  } else {
    router.push({ path: '/catalog' });
  }
};

const selectCategory = (categoryId: string): void => {
  activeCategory.value = activeCategory.value === categoryId ? null : categoryId;
};
</script>

<template>
  <div class="category-buttons d-flex flex-wrap ga-3">
    <v-btn
      v-for="category in availableCategories"
      :key="category.id"
      :color="category.color"
      size="x-large"
      @click="selectCategory(category.id)"
      class="category-btn px-4"
      :class="{ 'active-category': category.isActive }"
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
