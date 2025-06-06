<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { getProductById } from '../../services/product-service';
import Snackbar from '../../components/layout/snack-bar.vue';
import { useSnackbarStore } from '../../stores/snackbar';
import { formatPrice } from '../../utils/format-price';
import type { ProductView } from '../../types/product';
import { mapProductDataToProductView } from '../../utils/map-product';
import CategoryButtons from '../../components/layout/category-buttons.vue';
import Carousel from '../../components/layout/carousel.vue';
import Modal from '../../components/layout/modal.vue';

const snackbarStore = useSnackbarStore();
const errorMessage = 'Failed to fetch product';
const backButtonText = 'Back to catalog';
const { id } = defineProps<{ id: string }>();
let product = ref<ProductView | null>(null);
const isModalOpen = ref(false);
const modalComponent = shallowRef();
const modalProps = ref();
const widthModal = 1200;
const buttonTextAdd = 'Add to Cart';
onMounted(async () => {
  try {
    const productData = await getProductById(id);
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

const currentCategory = computed(() => {
  return product.value?.categories?.[0]?.id || null;
});

const addToCart = (): void => {
  console.log('add to cart');
};
</script>
<template>
  <v-container class="py-6" v-if="product">
    <v-row class="justify-center align-center ga-16">
      <v-btn to="/catalog" color="primary" variant="flat" prepend-icon="mdi-arrow-left">
        {{ backButtonText }}
      </v-btn>
      <CategoryButtons with-routing :current-category="currentCategory" />
    </v-row>

    <v-row justify="center" class="gap-4">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="2" class="card pa-4 rounded-xl">
          <Carousel :images="product.images" :onClick="openModal" />

          <h1 class="text-h4 font-weight-bold mb-4">
            {{ product.name }}
          </h1>

          <div class="text-body-1" v-if="product.description">
            {{ product.description }}
          </div>
          <div class="price-container mt-2">
            <span class="original-price" v-if="product.price !== null">{{
              formatPrice(product.price)
            }}</span>
            <span class="discounted-price" v-if="product.priceDiscounted !== null">{{
              formatPrice(product.priceDiscounted)
            }}</span>
          </div>
          <v-card-actions class="addBtn pb-4">
            <v-btn color="primary" variant="flat" block @click="addToCart">
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

.original-price {
  text-decoration: line-through;
  color: v.$color-grey;
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
