<script setup lang="ts">
import { onMounted, computed, ref, shallowRef } from 'vue';
import Snackbar from '../../components/layout/snack-bar.vue';
import { useSnackbarStore } from '../../stores/snackbar';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { Pages } from '../../enums/pages';
import {
  getCart,
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
import { formatPrice } from '../../utils/format-price';
import { dollarSing } from '../../constants/constants';
import Modal from '../../components/layout/modal.vue';
import ConfirmClearCart from '../../components/layout/confirm-clear-cart.vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
const promoCode = ref<string>('');
const isPromoApplied = ref(false);
const buttonColor = computed(() => (isPromoApplied.value ? 'green' : 'gray'));
const isLoading = ref(false);
const isModalOpen = ref(false);
const modalComponent = shallowRef();

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
  if (!cartStore.cart) return formatPrice(0);

  const originalTotal = cartStore.cart.lineItems.reduce(
    (sum, item) => sum + item.price.value.centAmount * item.quantity,
    0,
  );

  return formatPrice(originalTotal);
});

const discountedPrice = computed(() => {
  if (!cartStore.cart) return formatPrice(0);

  return formatPrice(cartStore.cart.totalPrice.centAmount);
});

const discountAmount = computed(() => {
  if (!cartStore.cart) return 0;

  const originalTotal = cartStore.cart.lineItems.reduce(
    (sum, item) => sum + item.price.value.centAmount * item.quantity,
    0,
  );

  return (originalTotal - cartStore.cart.totalPrice.centAmount) / 100;
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
function handelClearCart(): void {
  modalComponent.value = ConfirmClearCart;
  isModalOpen.value = true;
}
const modalProps = {
  close: (): void => {
    isModalOpen.value = false;
  },
};
</script>
<template>
  <v-container class="py-6 cart-container" :class="{ 'theme-dark': isDark }">
    <div class="hero-cart" :class="{ 'theme-dark': isDark }">
      <h2 class="hero_title">{{ Pages.Cart }}</h2>
    </div>
    <CartMessage v-if="isCartEmpty" :class="{ 'theme-dark': isDark }" />
    <template v-else>
      <CartList :class="{ 'theme-dark': isDark }" />
      <v-card flat :class="{ 'theme-dark': isDark }">
        <v-row no-gutters>
          <v-col cols="5" class="text-end"></v-col>
          <v-col cols="5" class="text-end">
            <v-text-field
              v-model="promoCode"
              :label="Placeholders.placeholderPromo"
              :disabled="isPromoApplied"
              :class="{ 'text-field-dark': isDark }"
            />
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-btn
              icon
              :color="buttonColor"
              :disabled="!promoCode.trim() || isLoading"
              :loading="isLoading"
              @click="applyPromo"
            >
              <v-icon>mdi-check-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-card
        flat
        v-if="discountAmount > 0"
        data-test="discount-card"
        :class="{ 'theme-dark': isDark }"
      >
        <v-row no-gutters>
          <v-col cols="10" class="text-end text-subtitle-1 font-weight-bold">
            {{ AppNames.promoSubtotal }}
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            {{ totalPrice }}
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="10" class="text-end text-subtitle-1 font-weight-bold">
            {{ AppNames.promoDiscount }}
          </v-col>
          <v-col
            cols="2"
            class="d-flex align-center justify-center font-weight-bold discountAmount"
          >
            -{{ dollarSing }}{{ discountAmount.toFixed(2) }}
          </v-col>
        </v-row>
      </v-card>
      <v-card flat :class="{ 'theme-dark': isDark }">
        <v-row no-gutters>
          <v-col cols="10" class="text-end text-subtitle-1 font-weight-bold">
            {{ AppNames.promoTotal }}
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center font-weight-bold">
            {{ discountedPrice }}
          </v-col>
        </v-row>
      </v-card>
      <button class="button button-left" @click="handelClearCart" v-if="!isCartEmpty">
        {{ textPage.clearButton }}
      </button>
    </template>
  </v-container>
  <Modal v-model="isModalOpen" :component="modalComponent" :componentProps="modalProps" />

  <Snackbar />
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
@use '../../assets/styles/variables.scss' as v;

.cart-container {
  background-color: v.$color-white;
  color: v.$color-black;

  &.theme-dark {
    background-color: v.$color-background-dark;
  }
}

.hero-cart {
  @include hero-section('../../assets/images/cart.png');

  &.theme-dark {
    background-color: rgba(0, 0, 0, 0.7);

    .hero_title {
      color: v.$color-white;
    }
  }
}

.v-card {
  background-color: inherit;
  color: inherit;

  .v-row {
    color: inherit;
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
}

.button-left {
  display: block;
  margin-left: 0;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: v.$color-red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: v.$color-hover;
  }
}
.text-field-dark {
  :deep(.v-field) {
    background-color: #2d2d2d !important;
    color: v.$color-white !important;

    .v-field__input {
      color: v.$color-white !important;
    }

    .v-label {
      color: rgba(v.$color-white, 0.7) !important;
    }
  }
}
.v-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &[color='gray'] {
    color: #757575;

    .theme-dark & {
      color: #9e9e9e;
    }
  }

  &[color='green'] {
    color: v.$color-green;

    .theme-dark & {
      color: v.$color-green-light;
    }
  }
}
.theme-dark {
  .text-subtitle-1,
  .font-weight-bold {
    color: v.$color-white !important;
  }

  .v-chip {
    background-color: #2d2d2d;
    color: v.$color-white;
  }
}
</style>
