<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import productApi from '../../services/product-service';
import type { ProductProjection } from '@commercetools/platform-sdk';
import ProductCard from '../../components/product/product-card.vue';
import { BreakpointsItemsPerPage, DefaultItemsPerPage } from '../../constants/constants';
import { useDisplay } from 'vuetify';
import CategoryButtons from '../../components/layout/category-buttons.vue';
import { useRoute } from 'vue-router';
import { Errors } from '../../enums/errors';
import {
  categoriesId,
  sortOptions,
  availableBrands,
  availableSportTypes,
} from '../../constants/constants';

const route = useRoute();
const products = ref<ProductProjection[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(DefaultItemsPerPage);
const totalProducts = ref(0);
const search = ref<string>('');
const display = useDisplay();
const categories = ref<string[]>([]);
const brands = ref<string[]>([]);
const sportTypes = ref<string[]>([]);
const selectedSort = ref('name.en-US asc');
let searchTimeout: ReturnType<typeof globalThis.setTimeout> | undefined;

const availableCategories = categoriesId.map(cat => ({
  name: cat.name,
  id: cat.id,
}));

const loadProducts = async (offset = 0): Promise<void> => {
  try {
    isLoading.value = true;

    let sortParameter = selectedSort.value;
    if (sortParameter.includes('price')) {
      const direction = sortParameter.split(' ')[1];
      sortParameter = `price ${direction}`;
    }

    const response = await productApi.getProducts(
      itemsPerPage.value,
      offset,
      [sortParameter],
      'USD',
      search.value,
      {
        categories: categories.value,
        brands: brands.value,
        sportTypes: sportTypes.value,
      },
    );
    products.value = response.results;
    console.log(response.results);
    totalProducts.value = response.total || 0;
  } catch (error_) {
    error.value = error_ instanceof Error ? error_.message : Errors.UnknownError;
  } finally {
    isLoading.value = false;
  }
};

const resetFilters = (): void => {
  categories.value = [];
  brands.value = [];
  sportTypes.value = [];
  loadProducts(0);
};

watch(search, () => {
  globalThis.clearTimeout(searchTimeout);
  searchTimeout = globalThis.setTimeout(() => {
    currentPage.value = 1;
    loadProducts(0);
  }, 300);
});

const updateItemsPerPage = (breakpoint: string): void => {
  itemsPerPage.value =
    BreakpointsItemsPerPage[breakpoint as keyof typeof BreakpointsItemsPerPage] ||
    DefaultItemsPerPage;
  currentPage.value = 1;
  loadProducts(0);
};

watch(() => display.name.value, updateItemsPerPage, { immediate: true });
watch(selectedSort, () => {
  currentPage.value = 1;
  loadProducts(0);
});

const handlePageChange = (page: number): void => {
  currentPage.value = page;
  const offset = (page - 1) * itemsPerPage.value;
  loadProducts(offset);
};

const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value));

const handleCategoryChange = (): void => {
  loadProducts(0);
};

onMounted(() => {
  if (route.query.category) {
    categories.value = [route.query.category as string];
    loadProducts(0);
  }
});
</script>
<template>
  <div class="catalog-page">
    <div v-if="isLoading">Загрузка товаров...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <h3>Available products: {{ totalProducts }}</h3>
      <div class="tools">
        <v-select
          v-model="selectedSort"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          label="Sort by ..."
          density="comfortable"
          style="min-width: 300px"
          variant="outlined"
        ></v-select>
        <CategoryButtons v-model="categories" @change="handleCategoryChange" />
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          style="min-width: 300px"
        ></v-text-field>
      </div>

      <v-container class="main-container">
        <div class="filters-container">
          <div class="filter-section">
            <h4>Category</h4>
            <v-checkbox
              v-for="category in availableCategories"
              :key="category.id"
              v-model="categories"
              :label="category.name"
              :value="category.id"
              @update:modelValue="loadProducts(0)"
            />
          </div>

          <div class="filter-section">
            <h4>Brand</h4>
            <v-checkbox
              v-for="brand in availableBrands"
              :key="brand"
              v-model="brands"
              :label="brand"
              :value="brand"
              @update:modelValue="loadProducts(0)"
            />
          </div>

          <div class="filter-section">
            <h4>Sport Type</h4>
            <v-checkbox
              v-for="type in availableSportTypes"
              :key="type"
              v-model="sportTypes"
              :label="type"
              :value="type"
              @update:modelValue="loadProducts(0)"
            />
          </div>

          <v-btn @click="resetFilters" color="primary" class="reset-btn"> Reset Filters </v-btn>
        </div>
        <div class="cards-container">
          <v-row class="card-row">
            <v-col
              v-for="product in products"
              :key="product.id"
              cols="12"
              sm="6"
              md="6"
              lg="4"
              xl="3"
            >
              <RouterLink :to="'/product/' + product.id">
                <ProductCard :product="product" />
              </RouterLink>
            </v-col>
          </v-row>
        </div>
      </v-container>
      <v-container class="d-flex justify-center" v-if="totalProducts > itemsPerPage">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="3"
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
  .tools {
    padding: 50px 0;
    display: flex;
    justify-content: space-between;
    :deep(.v-text-field) {
      height: 50px;
    }
    .category-buttons {
      display: flex;
      gap: 20px;
      margin: 0 20px;

      @media (max-width: 600px) {
        gap: 10px;
      }
    }
  }
  .main-container {
    padding: 20px 0;
    display: flex;
    justify-content: space-between !important;
    gap: 35px;

    .filters-container {
      min-width: 300px;
      background: v.$color-lightgray;
      border-radius: 8px;
      padding-top: 20px;
      align-self: flex-start;
      max-height: calc(100vh - 40px);
      overflow-y: auto;

      .filter-section {
        margin-bottom: 10px;

        h4 {
          margin-bottom: 10px;
          font-weight: 500;
        }
        .v-input {
          height: 36.2px;
        }
      }

      .reset-btn {
        margin: 20px 0 15px 0;
        width: 90%;
        color: v.$color-red;
      }
    }
  }
}
.v-container {
  max-width: none !important;
}

@media (max-width: 960px) {
  .tools {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
  .main-container {
    flex-direction: column;
    .filters-container {
      width: 100%;
    }
  }
}
</style>
