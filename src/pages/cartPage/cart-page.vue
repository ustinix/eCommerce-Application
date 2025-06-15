<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import Snackbar from '../../components/layout/snack-bar.vue';
import { useSnackbarStore } from '../../stores/snackbar';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { Pages } from '../../enums/pages';
import {
  getCart,
  clearCart,
  removePromoCode,
  applyPromoCode,
  getDiscountCodeById,
} from '../../services/cart-service';
import { Errors } from '../../enums/errors';
import { Success } from '../../enums/success';
import { AppNames } from '../../enums/app-names';
import CartMessage from '../../components/layout/cart-message.vue';
import CartList from '../../components/layout/cart-list.vue';
import { Placeholders } from '../../enums/placeholders';

const promoCode = ref<string>('');
const isPromoApplied = ref(false);
const butttonColor = computed(() => (isPromoApplied.value ? 'green' : 'gray'));
const isLoading = ref(false);

const authStore = useAuthStore();
const cartStore = useCartStore();
const snackbarStore = useSnackbarStore();
const textPage = { clearButton: 'CLEAR SHOPPING CART' };

const loadPromoCodeDetails = async (): Promise<void> => {
  if (cartStore.cart?.discountCodes?.length) {
    const discountCodeId = cartStore.cart.discountCodes[0].discountCode.id;
    promoCode.value = await getDiscountCodeById(authStore, discountCodeId);
  }
};

onMounted(async () => {
  try {
    await getCart(authStore, cartStore);
    if (cartStore.cart?.discountCodes?.length) {
      isPromoApplied.value = true;
      await loadPromoCodeDetails();
    }
  } catch {
    snackbarStore.error(Errors.LoadingCart);
  }
});

const isCartEmpty = computed(() => {
  return cartStore.cart === null || cartStore.cart?.lineItems.length === 0;
});

const totalPrice = computed(() => {
  return cartStore.cart?.totalPrice?.centAmount ? cartStore.cart.totalPrice.centAmount / 100 : 0;
});

const finalPrice = computed(() => Math.max(0, totalPrice.value - (discountAmount.value ?? 0)));

const discountAmount = computed(() => {
  if (!cartStore.cart?.discountOnTotalPrice) return 0;

  return cartStore.cart.discountOnTotalPrice.discountedAmount.centAmount / 100;
});

const applyPromo = async (): Promise<void> => {
  if (!promoCode.value.trim()) return;

  isLoading.value = true;
  try {
    if (isPromoApplied.value) {
      const discountCodeId = cartStore.cart?.discountCodes?.[0]?.discountCode?.id;
      if (!discountCodeId) throw new Error(Errors.PromoNotFound);
      await removePromoCode(authStore, cartStore, discountCodeId);
      snackbarStore.success(Success.PromoRemove);
      promoCode.value = '';
      isPromoApplied.value = false;
    } else {
      await applyPromoCode(authStore, cartStore, promoCode.value);
      snackbarStore.success(Success.PromoApply);
      isPromoApplied.value = true;
    }
  } catch (error) {
    snackbarStore.error(error instanceof Error ? error.message : Errors.ApplyPromo);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <v-container class="py-6 cart-container">
    <div class="hero-cart">
      <h2 class="hero_title">{{ Pages.Cart }}</h2>
    </div>
    <CartMessage v-if="isCartEmpty" />
    <template v-else>
      <CartList />
      <v-card flat>
        <v-row no-gutters>
          <v-col cols="5" class="text-end"></v-col>
          <v-col cols="5" class="text-end">
            <v-text-field
              v-model="promoCode"
              :label="Placeholders.placeholderPromo"
              :disabled="isPromoApplied"
            />
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-btn
              icon
              :color="butttonColor"
              :disabled="!promoCode.trim() || isLoading"
              :loading="isLoading"
              @click="applyPromo"
            >
              <v-icon>mdi-check-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-card flat v-if="discountAmount > 0">
        <v-row no-gutters>
          <v-col cols="10" class="text-end text-subtitle-1 font-weight-bold">{{
            AppNames.promoSubtotal
          }}</v-col>
          <v-col cols="2" class="d-flex align-center justify-center">{{
            (totalPrice || 0).toFixed(2)
          }}</v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="10" class="text-end text-subtitle-1 font-weight-bold">{{
            AppNames.promoDiscount
          }}</v-col>
          <v-col cols="2" class="d-flex align-center justify-center font-weight-bold discountAmount"
            >-{{ discountAmount }}</v-col
          >
        </v-row>
      </v-card>
      <v-card flat>
        <v-row no-gutters>
          <v-col cols="10" class="text-end text-subtitle-1 font-weight-bold">{{
            AppNames.promoTotal
          }}</v-col>
          <v-col cols="2" class="d-flex align-center justify-center font-weight-bold">
            {{ finalPrice.toFixed(2) }}
          </v-col>
        </v-row>
      </v-card>
      <button class="button button-left" @click="clearCart" v-if="!isCartEmpty">
        {{ textPage.clearButton }}
      </button>
    </template>
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
  min-height: 48px;
  align-items: center;
  .text-end {
    text-align: end;
  }
  .discountAmount {
    color: v.$color-red;
  }
}
.button-left {
  display: block;
  margin-left: 0;
}
</style>
