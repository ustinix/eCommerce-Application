<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';

import Snackbar from '../../components/layout/snack-bar.vue';
import { useSnackbarStore } from '../../stores/snackbar';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { Pages } from '../../enums/pages';
import { getCart } from '../../services/cart-service';
import { Errors } from '../../enums/errors';
import CartMessage from '../../components/layout/cart-message.vue';
import CartList from '../../components/layout/cart-list.vue';
import BaseInput from '../../components/layout/base-input.vue';
import { Placeholders } from '../../enums/placeholders';
import { Labels } from '../../enums/labels';
import { validatePromo } from '../../utils/validate-promo';

const promoCode = ref<string>('');

const authStore = useAuthStore();
const cartStore = useCartStore();
const snackbarStore = useSnackbarStore();

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
    <v-card flat class="py-2 border-b border-red">
      <v-row align="center" no-gutters>
        <v-col cols="5" class="text-end summ">
          <BaseInput
            data-test="name-input"
            v-model="promoCode"
            :label="Labels.promoCode"
            :placeholder="Placeholders.placeholderPromo"
            required
            type="text"
            :validate="validatePromo"
          />
        </v-col>
      </v-row>
    </v-card>
    <v-card flat class="py-2 border-b border-red">
      <v-row align="center" no-gutters>
        <v-col cols="10" class="text-end summ">Скидка:</v-col>
        <v-col cols="1" class="text-end summ">12345</v-col>
        <v-col cols="1" class="text-end summ"></v-col>
      </v-row>
    </v-card>
    <v-card flat class="py-2 border-b border-red">
      <v-row align="center" no-gutters>
        <v-col cols="10" class="text-end summ">Total:</v-col>
        <v-col cols="1" class="text-end summ">12345</v-col>
        <v-col cols="1" class="text-end summ"></v-col>
      </v-row>
    </v-card>
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
