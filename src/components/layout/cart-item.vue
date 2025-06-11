<script setup lang="ts">
import type { LineItem } from '@commercetools/platform-sdk';
import { mapCartItem } from '../../utils/map-cart-item';
import { formatPrice } from '../../utils/format-price';
import { computed, ref } from 'vue';
import type { cartItem } from '../../types/cart';
import { removeProduct } from '../../services/cart-service';
import { useSnackbarStore } from '../../stores/snackbar';
import Snackbar from './snack-bar.vue';

const props = defineProps<{ lineItem: LineItem }>();
const dataItem = ref<cartItem>(mapCartItem(props.lineItem));
const snackbarStore = useSnackbarStore();
const isDisable = ref<boolean>(false);

const successDelete = 'The product has been permanently removed.';
const errorDeleteProduct = 'Error removed.';

function removeItem(): void {
  try {
    removeProduct(dataItem.value.id, dataItem.value.quantity);
    snackbarStore.success(successDelete);
  } catch {
    snackbarStore.error(errorDeleteProduct);
  }
}
function decreaseQty(): void {
  isDisable.value = true;
  if (dataItem.value.quantity <= 1) return;
  const quantity = dataItem.value.quantity - 1;
  try {
    removeProduct(dataItem.value.id, quantity);
    dataItem.value.quantity = quantity;
  } catch {
    snackbarStore.error(errorDeleteProduct);
  } finally {
    isDisable.value = false;
  }
}
function increaseQty(): void {
  console.log('increase');
}

const price = computed(() => formatPrice(dataItem.value.price));

const totalPrice = computed(() => {
  const total = dataItem.value.price * dataItem.value.quantity;
  return formatPrice(total);
});
const isDecreaseDisabled = (): boolean => dataItem.value.quantity < 1 && isDisable.value;
</script>
<template>
  <v-card flat class="py-2 px-4 border-b cart-item">
    <v-row align="center" no-gutters>
      <v-col cols="1">
        <v-img
          :src="dataItem.imageUrl"
          height="64"
          width="64"
          cover
          style="object-fit: cover; min-width: 64px"
        ></v-img>
      </v-col>
      <v-col cols="3">
        <div class="text-subtitle-1 font-weight-medium">{{ dataItem.name }}</div>
      </v-col>
      <v-col cols="1" class="size">
        <div class="text-subtitle-1 font-weight-medium">
          {{ dataItem.sizes }}
        </div>
      </v-col>
      <v-col cols="2">
        <div class="text-subtitle-1 font-weight-bold">{{ price }}</div>
      </v-col>
      <v-col cols="2" class="d-flex align-center">
        <v-btn icon size="small" @click="decreaseQty" :disabled="isDecreaseDisabled()">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <div class="mx-2 text-body-1 font-weight-medium">{{ dataItem.quantity }}</div>
        <v-btn icon size="small" @click="increaseQty" :disabled="isDisable">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="2">
        <div class="text-subtitle-1 font-weight-bold">{{ totalPrice }}</div>
      </v-col>
      <v-col cols="2" class="text-end">
        <v-btn icon color="red" @click="removeItem">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
  <Snackbar />
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.cart-item {
  border-bottom: 1px solid v.$color-red !important;
  margin-bottom: 10px;
}
</style>
