<script setup lang="ts">
import { clearCart } from '../../services/cart-service';
import { Errors } from '../../enums/errors';
import { Success } from '../../enums/success';
import { useSnackbarStore } from '../../stores/snackbar';

const snackbarStore = useSnackbarStore();
const props = defineProps<{ close: () => void }>();
const textComponent = {
  text: 'Are you sure you want to clear the shopping cart?',
  cancelButton: 'Cancel',
  confirmButton: 'Clear',
};
async function confirm(): Promise<void> {
  try {
    await clearCart();
    snackbarStore.success(Success.ClearCart);
  } catch {
    snackbarStore.error(Errors.ClearCart);
  } finally {
    props.close();
  }
}
</script>

<template>
  <div class="pa-4">
    <p>{{ textComponent.text }}</p>
    <div class="pt-2 d-flex justify-end">
      <button class="button mr-2" @click="props.close">
        {{ textComponent.cancelButton }}
      </button>
      <button class="button" @click="confirm">{{ textComponent.confirmButton }}</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
