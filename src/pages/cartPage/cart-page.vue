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
import { Placeholders } from '../../enums/placeholders';

const promoCode = ref<string>('');
const isPromoApplied = ref(false);
const butttonColor = computed(() => (isPromoApplied.value ? 'green' : 'gray'));

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
const applyPromo = (): void => {
  if (!promoCode.value.trim()) return;

  isPromoApplied.value = !isPromoApplied.value;
};
</script>
<template>
  <v-container class="py-6 cart-container">
    <div class="hero-cart">
      <h2 class="hero_title">{{ Pages.Cart }}</h2>
    </div>
    <CartMessage v-if="isCartEmpty" />
    <CartList v-else />
    <v-card flat class="py-2 px-10">
      <v-row no-gutters>
        <v-col cols="10" class="text-end summ">
          <v-text-field v-model="promoCode" :label="Placeholders.placeholderPromo" />
        </v-col>
        <v-col cols="2" class="text-end">
          <v-btn icon :color="butttonColor" :disabled="!promoCode.trim()" @click="applyPromo">
            <v-icon>mdi-check-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card flat class="py-2 px-10">
      <v-row no-gutters>
        <v-col cols="8" class="text-end summ">Скидка:</v-col>
        <v-col cols="4" class="text-end summ">12345</v-col>
      </v-row>
    </v-card>
    <v-card flat class="py-2 px-10">
      <v-row no-gutters>
        <v-col cols="8" class="text-end summ">Total:</v-col>
        <v-col cols="4" class="text-end summ">12345</v-col>
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
.v-row {
  border-bottom: 1px solid v.$color-red !important;
  padding: 5px 0;
  .text-end {
    text-align: end;
  }
}
</style>
