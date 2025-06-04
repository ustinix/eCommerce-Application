<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { getProductById } from '../../services/product-service';
import Snackbar from '../../components/layout/snack-bar.vue';
import { useSnackbarStore } from '../../stores/snackbar';
import { formatPrice } from '../../utils/format-price';
import type { ProductView } from '../../types/product';
import { mapProductDataToProductView } from '../../utils/map-product';
import CategoryButtons from '../../components/layout/category-buttons.vue';

const snackbarStore = useSnackbarStore();
const errorMessage = 'Failed to fetch product';
const backButtonText = 'Back to catalog';
const { id } = defineProps<{ id: string }>();
let product = ref<ProductView | null>(null);

onMounted(async () => {
  try {
    const productData = await getProductById(id);
    product.value = mapProductDataToProductView(productData);
  } catch {
    snackbarStore.error(errorMessage);
  }
});

const showArrows = (): boolean => (product.value ? product.value?.images.length > 1 : false);

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

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="2" class="pa-4 rounded-xl">
          <v-carousel
            hide-delimiter-background
            :show-arrows="showArrows()"
            height="400"
            cycle
            class="mb-6 rounded-lg"
          >
            <v-carousel-item v-for="(img, i) in product.images" :key="i">
              <v-img
                :src="img.url"
                :style="{ objectFit: 'contain' }"
                width="100%"
                height="100%"
                class="rounded-lg"
              />
            </v-carousel-item>
          </v-carousel>
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>

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
</style>
