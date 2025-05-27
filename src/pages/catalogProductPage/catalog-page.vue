<script setup lang="ts">
import { onMounted, ref } from 'vue';
import productApi from '../../services/product-service';
import type { ProductProjection } from '@commercetools/platform-sdk';

const products = ref<ProductProjection[]>([]);

const isLoading = ref(true);
const error = ref<string | null>(null);

const loadProducts = async (): Promise<void> => {
  try {
    const response = await productApi.getProducts(100, 0);
    products.value = response.results;

    console.log('Полученные товары:', products.value);
  } catch (error_) {
    error.value = error_ instanceof Error ? error_.message : 'Неизвестная ошибка';
    console.error('Ошибка загрузки:', error_);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});
</script>
<template>
  <div class="catalog-page">
    <div v-if="isLoading">Загрузка товаров...</div>

    <div v-else>
      <h3>Найдено товаров: {{ products.length }}</h3>

      <ul class="product-list">
        <li v-for="product in products" :key="product.id" class="product-item">
          <h4>{{ product.name?.['en-US'] }}</h4>
          <p v-if="product.description">
            {{ product.description?.['en-US'] }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.catalog-page {
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  text-align: center;
  ul {
    list-style: none;
    padding: 0;
    margin-top: 20px;

    li {
      padding: 8px;
      border-bottom: 1px solid v.$color-grey;
    }
  }
}
</style>
