<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import productApi from '../../services/product-service';
import type { ProductProjection } from '@commercetools/platform-sdk';
import ProductCard from '../../components/product/product-card.vue';
import { BreakpointsItemsPerPage, DefaultItemsPerPage } from '../../assets/constants';
import { useDisplay } from 'vuetify';

const products = ref<ProductProjection[]>([]);

const isLoading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(DefaultItemsPerPage);
const totalProducts = ref(0);
const display = useDisplay();

const loadProducts = async (offset = 0): Promise<void> => {
  try {
    isLoading.value = true;
    const response = await productApi.getProducts(itemsPerPage.value, offset);
    products.value = response.results;
    totalProducts.value = response.total || 0;

    console.log('Полученные товары:', products.value);
  } catch (error_) {
    error.value = error_ instanceof Error ? error_.message : 'Неизвестная ошибка';
    console.error('Ошибка загрузки:', error_);
  } finally {
    isLoading.value = false;
  }
};

const updateItemsPerPage = (breakpoint: string) => {
  itemsPerPage.value =
    BreakpointsItemsPerPage[breakpoint as keyof typeof BreakpointsItemsPerPage] ||
    DefaultItemsPerPage;
  currentPage.value = 1;
  loadProducts(0);
};

watch(() => display.name.value, updateItemsPerPage, { immediate: true });

const handlePageChange = (page: number) => {
  currentPage.value = page;
  const offset = (page - 1) * itemsPerPage.value;
  loadProducts(offset);
};

const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value));

const addToCart = (item: { productId: string; size: string }) => {
  console.log('Добавление в корзину:', item);
};

onMounted(() => {
  updateItemsPerPage(display.name.value);
  loadProducts();
});
</script>
<template>
  <div class="catalog-page">
    <div v-if="isLoading">Загрузка товаров...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <h3>Available products: {{ totalProducts }}</h3>

      <v-container class="pt-5">
        <v-row class="d-flex justify-space-between ga-3">
          <v-col
            v-for="product in products"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
          >
            <ProductCard :product="product" @add-to-cart="addToCart" />
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="totalProducts > itemsPerPage">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          @update:model-value="handlePageChange"
          class="mt-6"
        ></v-pagination>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.catalog-page {
  margin: 0 auto;
  padding: 20px;
  .error-message {
    color: v.$color-red;
  }
}
</style>
