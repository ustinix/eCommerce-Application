<script setup lang="ts">
import CartItem from './cart-item.vue';
import { useCartStore } from '../../stores/cart';
import { computed } from 'vue';

const cartStore = useCartStore();
const listItems = computed(() => cartStore.cart?.lineItems ?? []);

const tableHeader = [
  { id: 'image', text: 'IMAGE', size: 1 },
  { id: 'name', text: 'PRODUCT NAME', size: 3 },
  { id: 'size', text: 'SIZE', size: 1 },
  { id: 'price', text: 'PRICE', size: 1 },
  { id: 'quantity', text: 'QUANTITY', size: 2 },
  { id: 'total', text: 'TOTAL', size: 2 },
  { id: 'delete', text: 'DELETE', size: 2 },
];
</script>
<template>
  <v-card flat class="py-2">
    <v-row align="center" no-gutters class="table-header d-none d-md-flex">
      <v-col :cols="item.size" v-for="item of tableHeader" :key="item.id">
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
