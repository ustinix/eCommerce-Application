<script setup lang="ts">
import { computed, ref } from 'vue';
import { Errors } from '../../enums/errors';
import type { ProductProjection } from '@commercetools/platform-sdk';
import { formatPrice } from '../../utils/format-price';
import { AppNames } from '../../enums/app-names';
import { mapProductProjection } from '../../utils/map-product-projection';
import { useCartStore } from '../../stores/cart';
import { useAuthStore } from '../../stores/auth';
import { addProductToCart, removeProduct } from '../../services/cart-service';
import SizeSelector from '../layout/size-selector.vue';

const cartStore = useCartStore();
const authStore = useAuthStore();

const props = defineProps<{
  product: ProductProjection;
}>();

const productData = computed(() => mapProductProjection(props.product));

const firstSize = productData.value.sizes.at(0);
const selectedSize = ref(firstSize ? firstSize.id : null);

const selectedSku = computed(
  () => productData.value.sizes.find(item => item.id === selectedSize.value)?.sku,
);

const addToCart = (): void => {
  if (selectedSize.value === null) return;
  addProductToCart(authStore, cartStore, productData.value.id, selectedSize.value);
};

const removeFromCart = (): void => {
  const cartItem = cartStore.cart?.lineItems.find(
    product => product.variant.sku === selectedSku.value,
  );
  if (cartItem !== undefined) {
    removeProduct(cartItem.id, cartItem.quantity);
  }
};
const inCart = computed(() => {
  if (cartStore.cart === null || selectedSize.value === null) return false;
  return cartStore.cart?.lineItems.some(product => product.variant.sku === selectedSku.value);
});
</script>
<template>
  <v-card class="product-card">
    <RouterLink :to="'/product/' + product.id" class="product-card_link">
      <v-img :src="productData.image" :alt="productData.name" height="400" cover></v-img>

      <v-card-title class="d-flex flex-column align-center px-4 pt-4 pb-2">
        <h3 class="text-h6">{{ productData.name }}</h3>
        <div class="price-container mt-2">
          <span class="original-price" :class="{ 'line-through': productData.hasDiscount }">
            {{ formatPrice(productData.price) }}</span
          >
          <span v-if="productData.hasDiscount" class="discounted-price">{{
            formatPrice(productData.discountedPrice)
          }}</span>
        </div>
      </v-card-title>

      <v-card-text class="px-4 py-2 text-body-2">
        {{ productData.description || Errors.ProductDescription }}
      </v-card-text>

      <v-divider class="mx-4"></v-divider>
    </RouterLink>
    <v-card-text class="px-4 py-2">
      <span class="subheading">{{ AppNames.selectText }}</span>
      <SizeSelector v-model="selectedSize" :sizes="productData.sizes" />
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn
        color="primary"
        variant="flat"
        block
        @click="addToCart"
        :disabled="!selectedSize"
        v-if="!inCart"
      >
        {{ AppNames.buttonTextAdd }}
      </v-btn>
      <v-btn color="primary" variant="flat" block v-else @click="removeFromCart">
        {{ AppNames.buttonRemove }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.product-card {
  width: 100% !important;
  min-width: 296px;
  margin: 0 auto;
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  .price-container {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .line-through {
    text-decoration: line-through;
    opacity: 0.7;
  }

  .original-price {
    color: v.$color-black;
    font-size: 1rem;
  }

  .discounted-price {
    color: v.$color-red;
    font-weight: bold;
    font-size: 1.1rem;
  }
}

.v-card-title,
.v-card-text {
  color: v.$color-black;
}

.v-chip-group :deep(.v-slide-group__content) {
  justify-content: center;
}

.button-cart:hover {
  background-color: v.$color-hover !important;
}
</style>
