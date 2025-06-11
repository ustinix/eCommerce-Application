<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import type { LineItem } from '@commercetools/platform-sdk';
import Snackbar from '../../components/layout/snack-bar.vue';
import { useSnackbarStore } from '../../stores/snackbar';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { Pages } from '../../enums/pages';
import { getCart } from '../../services/cart-service';
import { Errors } from '../../enums/errors';
import CartMessage from '../../components/layout/cart-message.vue';
import CartItem from '../../components/layout/cart-item.vue';

const authStore = useAuthStore();
const cartStore = useCartStore();
const snackbarStore = useSnackbarStore();
let lineItems = ref<LineItem[]>([]);

onMounted(async () => {
  try {
    await getCart(authStore, cartStore);
    lineItems.value = cartStore.cart?.lineItems ?? [];
    console.log(lineItems.value);
  } catch {
    snackbarStore.error(Errors.LoadingCart);
  }
});
const isCartEmpty = computed(() => {
  return lineItems.value.length === 0;
});
</script>
<template>
  <v-container class="py-6">
    <div class="hero-cart">
      <h2 class="hero_title">{{ Pages.Cart }}</h2>
    </div>
    <CartMessage v-if="isCartEmpty" />
    <CartItem v-else v-for="item in lineItems" :key="item.id" :line-item="item" />
  </v-container>

  <Snackbar />
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
@use '../../assets/styles/variables.scss' as v;

.hero-cart {
  @include hero-section('../../assets/images/cart.png');
}
</style>
