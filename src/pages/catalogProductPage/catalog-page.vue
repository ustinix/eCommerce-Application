<script setup lang="ts">
import { onMounted, ref } from 'vue';
import productApi from '../../services/product-service';
import type { Product } from '@commercetools/platform-sdk';

const titlePage = 'Catalog page';
const textPage = 'catalog';

const products = ref<Product[]>([]);

const isLoading = ref(true);
const error = ref<string | null>(null);

const loadProducts = async (): Promise<void> => {
  try {
    const response = await productApi.getProducts(20, 0);
    products.value = response.results;

    // Логирование для отладки
    console.log('Полученные товары:', products.value);
    products.value.forEach(product => {
      console.log(
        `Товар ID: ${product.id}`,
        'Название:',
        product.masterData.current.name,
        'Описание:',
        product.masterData.current.description,
      );
    });
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
    <h1>{{ titlePage }}</h1>
    <p>{{ textPage }}</p>

    <div v-if="isLoading">Загрузка товаров...</div>

    <div v-else-if="error" class="error-message">Ошибка: {{ error }}</div>

    <div v-else>
      <h3>Найдено товаров: {{ products.length }}</h3>

      <ul class="product-list">
        <li v-for="product in products" :key="product.id" class="product-item">
          <h4>{{ product.masterData.current.name.en }}</h4>
          <p v-if="product.masterData.current.description?.en">
            {{ product.masterData.current.description.en }}
          </p>
          <p class="product-id">ID: {{ product.id }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
