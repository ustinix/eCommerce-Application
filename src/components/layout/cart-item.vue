<script setup lang="ts">
import type { LineItem } from '@commercetools/platform-sdk';
import { computed, ref } from 'vue';
import { mapCartItem } from '../../utils/map-cart-item';
import { formatPrice } from '../../utils/format-price';
import { Errors } from '../../enums/errors';
import type { cartItem } from '../../types/cart';
import { removeProduct, increaseQuantityProduct } from '../../services/cart-service';
import { useSnackbarStore } from '../../stores/snackbar';
import Snackbar from './snack-bar.vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const props = defineProps<{ lineItem: LineItem }>();
const dataItem = ref<cartItem>(mapCartItem(props.lineItem));
const snackbarStore = useSnackbarStore();
const isDisable = ref<boolean>(false);

const successDelete = 'The product has been permanently removed.';

function removeItem(): void {
  try {
    removeProduct(dataItem.value.id, dataItem.value.quantity);
    snackbarStore.success(successDelete);
  } catch {
    snackbarStore.error(Errors.DeleteProduct);
  }
}
async function decreaseQty(): Promise<void> {
  isDisable.value = true;
  if (dataItem.value.quantity <= 1) return;
  const quantity = dataItem.value.quantity - 1;
  try {
    await removeProduct(dataItem.value.id, quantity);
    dataItem.value.quantity = quantity;
  } catch {
    snackbarStore.error(Errors.DecreaseQty);
  } finally {
    isDisable.value = false;
  }
}
async function increaseQty(): Promise<void> {
  isDisable.value = true;
  const newQuantity = dataItem.value.quantity + 1;
  try {
    await increaseQuantityProduct(dataItem.value.id, newQuantity);
    dataItem.value.quantity = newQuantity;
  } catch {
    snackbarStore.error(Errors.IncreaseQty);
  } finally {
    isDisable.value = false;
  }
}

const price = computed(() => formatPrice(dataItem.value.price));

const totalPrice = computed(() => {
  const total = dataItem.value.price * dataItem.value.quantity;
  return formatPrice(total);
});
const isDecreaseDisabled = (): boolean => dataItem.value.quantity <= 1 || isDisable.value;
</script>
<template>
  <v-card flat class="py-2 border-b cart-item" :class="{ 'theme-dark': isDark }">
    <v-row align="center" no-gutters>
      <v-col cols="12" md="1" class="d-flex align-center justify-center">
        <v-img
          :src="dataItem.imageUrl"
          height="64"
          width="64"
          cover
          class="min-w-img no-grow-img"
        ></v-img>
      </v-col>

      <v-col cols="12" md="3" class="d-flex align-center justify-center">
        <div class="text-subtitle-4 text-sm-subtitle-1 font-weight-medium pa-4 pa-md-2">
          {{ dataItem.name }}
        </div>
      </v-col>

      <v-col cols="6" md="1" class="d-flex align-center justify-center">
        <div class="text-body-2 text-sm-subtitle-1 font-weight-medium">
          {{ dataItem.sizes }}
        </div>
      </v-col>

      <v-col cols="6" md="1" class="d-flex align-center justify-center">
        <div class="text-body-2 text-md-subtitle-1 font-weight-bold">
          {{ price }}
        </div>
      </v-col>

      <v-col cols="12" md="2" class="d-flex align-center justify-center mt-1 mt-md-0">
        <v-btn
          class="btnPlusMinus"
          icon
          size="small"
          @click="decreaseQty"
          :disabled="isDecreaseDisabled()"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <div class="mx-2 text-body-2 text-md-body-1 font-weight-medium">
          {{ dataItem.quantity }}
        </div>
        <v-btn class="btnPlusMinus" icon size="small" @click="increaseQty" :disabled="isDisable">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="6" md="2" class="d-flex align-center justify-center mt-1 mt-md-0">
        <div class="text-body-2 text-sm-subtitle-1 font-weight-bold">
          {{ totalPrice }}
        </div>
      </v-col>

      <v-col cols="6" md="2" class="d-flex align-center justify-center mt-1 mt-md-0">
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
.min-w-img {
  min-width: 100px;
  max-width: 100px;
}

.no-grow-img {
  flex-shrink: 0;
  flex-grow: 0;
}
.theme-dark {
  .btnPlusMinus {
    background-color: v.$color-background-dark !important;
    color: v.$color-white !important;

    &:hover:not(.v-btn--disabled) {
      background-color: v.$color-background-dark !important;
    }

    &.v-btn--disabled {
      background-color: v.$color-background-dark !important;
      color: rgba(v.$color-white, 0.5) !important;
    }
  }
}
.cart-item {
  border-bottom: 1px solid v.$color-red !important;
  margin-bottom: 10px;
  &.theme-dark {
    background-color: v.$color-background-dark;
    color: v.$color-white;
    border-bottom: 1px solid rgba(v.$color-red, 0.7);
  }
}
</style>
