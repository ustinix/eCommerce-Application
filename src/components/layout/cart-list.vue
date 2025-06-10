<script setup lang="ts">
import CartItem from './cart-item.vue';
import { useCartStore } from '../../stores/cart';
import { computed } from 'vue';

const cartStore = useCartStore();
const listItems = computed(() => cartStore.cart?.lineItems ?? []);
const textComponent = {
  image: 'IMAGE',
  name: 'PRODUCT NAME',
  price: 'PRICE',
  quantity: 'QUANTITY',
  total: 'TOTAL',
  delete: 'DELETE',
};
</script>
<template>
  <v-card flat class="py-2 px-10">
    <v-row align="center" no-gutters class="table-header">
      <v-col cols="2" v-for="field of textComponent">
        <div class="text-subtitle-1 font-weight-medium">{{ field }}</div>
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
