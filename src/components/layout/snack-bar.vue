<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSnackbarStore } from '../../stores/snackbar';
import { colorSnackbar } from '../../enums/color-snackbar';
const snackbarStore = useSnackbarStore();
const { message, isVisible } = storeToRefs(snackbarStore);
const defaultTime = 3000;
</script>
<template>
  <v-snackbar
    v-model="isVisible"
    :color="message?.color ?? colorSnackbar.success"
    :timeout="message?.timeout ?? defaultTime"
  >
    {{ message?.text }}
  </v-snackbar>
</template>
