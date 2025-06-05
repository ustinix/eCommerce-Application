<script setup lang="ts" generic="T extends Record<string, any>">
import type { DefineComponent } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  component: DefineComponent<T>;
  componentProps: T;
  width?: number;
}>();
const defaultWidth = 600;

const emit = defineEmits<(event: 'update:modelValue', value: boolean) => void>();
function closeModal(): void {
  emit('update:modelValue', false);
}
</script>

<template>
  <v-dialog
    :model-value="props.modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :max-width="props.width || defaultWidth"
  >
    <v-card>
      <v-card-text>
        <component
          :is="props.component"
          v-bind="{ ...props.componentProps, close: closeModal } as any"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style lang="scss" scoped>
.form-modal {
  max-width: 600px;
}
</style>
