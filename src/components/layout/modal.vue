<script setup lang="ts">
import type { DefineComponent } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  component: DefineComponent;
  componentProps?: Record<string, string>;
}>();

const emit = defineEmits<(event: 'update:modelValue', value: boolean) => void>();

function saveData(): void {
  console.log('save');
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
        <component :is="props.component" v-bind="props.componentProps" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="saveData">Save</v-btn>
        <v-btn color="secondary" @click="emit('update:modelValue', false)">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
