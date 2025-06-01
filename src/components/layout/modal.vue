<script setup lang="ts" generic="T extends Record<string, any>">
import type { DefineComponent } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  component: DefineComponent<T>;
  componentProps: T;
}>();

const emit = defineEmits<(event: 'update:modelValue', value: boolean) => void>();
function closeModal(): void {
  emit('update:modelValue', false);
}
</script>

<template>
  <v-dialog
    :model-value="props.modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    max-width="600"
  >
    <v-card>
      <v-card-text>
        <!--<component :is="props.component" v-bind="props.componentProps  as any" />-->
        <component
          :is="props.component"
          v-bind="{ ...(props.componentProps ?? {}), close: closeModal } as any"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" @click="closeModal">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
