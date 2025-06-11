<script setup lang="ts">
import type { LineItem } from '@commercetools/platform-sdk';
import { mapCartItem } from '../../utils/map-cart-item';

const props = defineProps<{ lineItem: LineItem }>();
const cartData = mapCartItem(props.lineItem);
console.log(cartData);

function removeItem(): void {
  console.log('remove');
}
function decreaseQty(): void {
  console.log('decreaseQty');
}
function increaseQty(): void {
  console.log('increaseQty');
}
const finalPrice = (): number => {
  return cartData.price ? cartData.price * cartData.quantity : 0;
};
</script>
<template>
  <v-card flat class="py-2 border-b border-red">
    <v-row align="center" no-gutters>
      <v-col cols="1" class="photo">
        <v-img
          :src="cartData.imageUrl"
          height="64"
          width="64"
          cover
          style="object-fit: cover; min-width: 64px"
        ></v-img>
      </v-col>
      <v-col cols="3" class="name">
        <div class="text-subtitle-1 font-weight-medium">
          {{ cartData.name }}
        </div>
      </v-col>
      <v-col cols="1" class="size">
        <div class="text-subtitle-1 font-weight-medium">
          {{ cartData.sizes }}
        </div>
      </v-col>
      <v-col cols="2" class="price">
        <div class="text-subtitle-1 font-weight-bold">{{ cartData.price }}</div>
      </v-col>

      <v-col cols="3" class="d-flex align-center quantity">
        <v-btn icon size="small" @click="decreaseQty">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <div class="mx-2 text-body-1 font-weight-medium">{{ cartData.quantity }}</div>
        <v-btn icon size="small" @click="increaseQty">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="1" class="finalPrice">
        <div class="text-subtitle-1 font-weight-bold">
          {{ finalPrice() }}
        </div>
      </v-col>

      <v-col cols="1" class="text-end remove">
        <v-btn icon color="red" @click="removeItem">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.border-red {
  border-bottom: 2px solid v.$color-red;
}
</style>
