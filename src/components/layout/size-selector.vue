<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string | number | null;
  sizes: { id: string | number; value: string }[];
}>();

const emit = defineEmits<(event: 'update:modelValue', value: string | number | null) => void>();

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});
</script>

<template>
  <v-chip-group v-model="model" selected-class="text-primary" mandatory class="mt-2 justify-center">
    <v-chip
      v-for="size in props.sizes"
      :key="size.id"
      :value="size.id"
      variant="outlined"
      size="small"
    >
      {{ size.value }}
    </v-chip>
  </v-chip-group>
</template>
