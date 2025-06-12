<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { getProductById } from '../../services/product-service';
import Snackbar from '../../components/layout/snack-bar.vue';
import { useSnackbarStore } from '../../stores/snackbar';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { formatPrice } from '../../utils/format-price';
import type { ProductView } from '../../types/product';
import { mapProductDataToProductView } from '../../utils/map-product';
import CategoryButtons from '../../components/layout/category-buttons.vue';
import Carousel from '../../components/layout/carousel.vue';
import Modal from '../../components/layout/modal.vue';
import { addProductToCart } from '../../services/cart-service';
import { Errors } from '../../enums/errors';
import { AppNames } from '../../enums/app-names';

const snackbarStore = useSnackbarStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const errorMessage = 'Failed to fetch product';
const backButtonText = 'Back to catalog';
const successMessage = 'Item added to cart';

const { id } = defineProps<{ id: string }>();
let product = ref<ProductView | null>(null);
const selectedSize = ref<number | null>(null);

const isModalOpen = ref(false);
const modalComponent = shallowRef();
const modalProps = ref();
const widthModal = 1200;
const buttonTextAdd = 'Add to Cart';
onMounted(async () => {
  try {
    const productData = await getProductById(id);
    console.log(' productData', productData);
    selectedSize.value = productData.variants[0].id;
    product.value = mapProductDataToProductView(productData);
  } catch {
    snackbarStore.error(errorMessage);
  }
});
function openModal(): void {
  if (product.value !== null) {
    modalComponent.value = Carousel;
    modalProps.value = { images: product.value.images };
    isModalOpen.value = true;
  }
}
function addInCart(): void {
  if (selectedSize.value === null) return;
  try {
    addProductToCart(authStore, cartStore, id, selectedSize.value);
    snackbarStore.success(successMessage);
  } catch {
    snackbarStore.error(Errors.ProductNotAdd);
  }
}

const currentCategory = computed(() => {
  return product.value?.categories?.[0]?.id || null;
});
</script>
<template>
  <v-container class="py-6" v-if="product">
    <v-row class="justify-center align-center ga-16">
      <v-btn to="/catalog" color="primary" variant="flat" prepend-icon="mdi-arrow-left">
        {{ backButtonText }}
      </v-btn>
      <CategoryButtons with-routing :current-category="currentCategory" />
    </v-row>

    <v-row justify="center" class="ga-5">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="2" class="card pa-4 rounded-xl ga-3">
          <Carousel :images="product.images" :onClick="openModal" />

          <h1 class="text-h4 font-weight-bold">
            {{ product.name }}
          </h1>
          <div class="price-container">
            <span
              class="original-price"
              v-if="product.price !== null"
              :class="{ 'line-through': product.priceDiscounted }"
              >{{ formatPrice(product.price) }}</span
            >
            <span class="discounted-price" v-if="product.priceDiscounted !== null">{{
              formatPrice(product.priceDiscounted)
            }}</span>
          </div>

          <div class="text-body-1" v-if="product.description">
            {{ product.description }}
          </div>
          <v-card-text class="px-4 py-2">
            <span class="subheading">{{ AppNames.selectText }}</span>
            <v-chip-group
              v-model="selectedSize"
              selected-class="text-primary"
              mandatory
              class="mt-2 justify-center"
            >
              <v-chip
                v-for="size in product.sizes"
                :key="size.id"
                :value="size.id"
                variant="outlined"
                size="small"
                >{{ size.value }}</v-chip
              >
            </v-chip-group>
          </v-card-text>
          <v-card-actions class="addBtn pb-4">
            <v-btn
              color="primary"
              variant="flat"
              block
              @click="addInCart"
              :disabled="!selectedSize"
            >
              {{ buttonTextAdd }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <Modal
    v-model="isModalOpen"
    :component="modalComponent"
    :componentProps="modalProps ?? {}"
    :width="widthModal"
  />
  <Snackbar />
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.price-container {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
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
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.addBtn {
  width: 50%;
  color: v.$color-red;
}
</style>
