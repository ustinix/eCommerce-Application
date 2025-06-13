<script setup lang="ts">
import CartItem from './cart-item.vue';
import { useCartStore } from '../../stores/cart';
import { computed } from 'vue';

const cartStore = useCartStore();
const listItems = computed(() => cartStore.cart?.lineItems ?? []);

const tableHeader = [
  { text: 'IMAGE', size: 1 },
  { text: 'PRODUCT NAME', size: 3 },
  { text: 'SIZE', size: 1 },
  { text: 'PRICE', size: 1 },
  { text: 'QUANTITY', size: 2 },
  { text: 'TOTAL', size: 2 },
  { text: 'DELETE', size: 2 },
];
</script>
<template>
  <v-card flat class="py-2">
    <v-row align="center" no-gutters class="table-header">
      <v-col :cols="item.size" v-for="item of tableHeader">
        <div class="text-subtitle-1 font-weight-medium">{{ item.text }}</div>
      </v-col>
    </v-row>
    <CartItem v-for="item in listItems" :key="item.id" :line-item="item" />
  </v-card>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.table-header {
  margin-top: 4rem;
  background-color: v.$color-black;
  color: v.$color-white;
}
</style>
