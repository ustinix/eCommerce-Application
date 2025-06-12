<script setup lang="ts">
import { onMounted, computed } from 'vue';

import Snackbar from '../../components/layout/snack-bar.vue';
import { useSnackbarStore } from '../../stores/snackbar';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { Pages } from '../../enums/pages';
import { getCart, clearCart } from '../../services/cart-service';
import { Errors } from '../../enums/errors';
import CartMessage from '../../components/layout/cart-message.vue';
import CartList from '../../components/layout/cart-list.vue';

const authStore = useAuthStore();
const cartStore = useCartStore();
const snackbarStore = useSnackbarStore();
const textPage = { clearButton: 'CLEAR SHOPPING CART' };

onMounted(async () => {
  try {
    await getCart(authStore, cartStore);
  } catch {
    snackbarStore.error(Errors.LoadingCart);
  }
});
const isCartEmpty = computed(() => {
  return cartStore.cart === null || cartStore.cart?.lineItems.length === 0;
});
</script>
<template>
  <v-container class="py-6">
    <div class="hero-cart">
      <h2 class="hero_title">{{ Pages.Cart }}</h2>
    </div>
    <CartMessage v-if="isCartEmpty" />
    <CartList v-else />
    <button class="button button-left" @click="clearCart" v-if="!isCartEmpty">
      {{ textPage.clearButton }}
    </button>
  </v-container>

  <Snackbar />
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
@use '../../assets/styles/variables.scss' as v;

.hero-cart {
  @include hero-section('../../assets/images/cart.png');
}
.button-left {
  display: block;
  margin-left: 0;
}
</style>
