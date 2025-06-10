<script setup lang="ts">
import type { LineItem } from '@commercetools/platform-sdk';
import { mapCartItem } from '../../utils/map-cart-item';
const props = defineProps<{ lineItem: LineItem }>();
console.log('data', mapCartItem(props.lineItem));

function removeItem(): void {
  console.log('remove');
}
function decreaseQty(): void {
  console.log('decreaseQty');
}
function increaseQty(): void {
  console.log('increaseQty');
}
</script>
<template>
  <v-card flat class="py-2 px-4 border-b border-red">
    <v-row align="center" no-gutters>
      <!-- Фото -->
      <v-col cols="2">
        <v-img src="" height="64" cover></v-img>
      </v-col>

      <!-- Название -->
      <v-col cols="2">
        <div class="text-subtitle-1 font-weight-medium">Sneakers</div>
      </v-col>

      <!-- Цена за штуку -->
      <v-col cols="2">
        <div class="text-subtitle-1 font-weight-bold"></div>
      </v-col>

      <!-- Кол-во -->
      <v-col cols="3" class="d-flex align-center">
        <v-btn icon size="small" @click="decreaseQty">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <div class="mx-2 text-body-1 font-weight-medium">1</div>
        <v-btn icon size="small" @click="increaseQty">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>

      <!-- Итоговая цена -->
      <v-col cols="2">
        <div class="text-subtitle-1 font-weight-bold"></div>
      </v-col>

      <!-- Удалить -->
      <v-col cols="1" class="text-end">
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
  border-bottom: 2px solid #f44336;
}
</style>
