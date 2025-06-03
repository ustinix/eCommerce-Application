<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getProductById } from '../../services/product-service';
import type { ProductData, Image } from '@commercetools/platform-sdk';
import Snackbar from '../../components/layout/snack-bar.vue';
import { useSnackbarStore } from '../../stores/snackbar';
import CategoryButtons from '../../components/layout/category-buttons.vue';

const snackbarStore = useSnackbarStore();
const errorMessage = 'Failed to fetch product';
const backButtonText = 'Back to catalog';
const { id } = defineProps<{ id: string }>();
let productData = ref<ProductData>();

const placeholderImage = {
  url: 'http://dummyimage.com/400x400/99cccc.gif&text=the+image+disappeared!',
  dimensions: {
    w: 400,
    h: 400,
  },
};

onMounted(async () => {
  try {
    productData.value = await getProductById(id);
    console.log(' productData.value', productData.value);
  } catch {
    snackbarStore.error(errorMessage);
  }
});
const images = computed(() => getImages());
function getImages(): Image[] {
  const images =
    productData.value && productData.value.masterVariant && productData.value.masterVariant.images
      ? productData.value.masterVariant.images
      : [];

  if (images.length === 0) {
    images.push(placeholderImage);
  }
  return images;
}
const showArrows = (): boolean => images.value.length > 1;

const currentCategory = computed(() => {
  return productData.value?.categories?.[0]?.id || null;
});
</script>
<template>
  <v-container class="py-6" v-if="productData">
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
            <v-carousel-item v-for="(img, i) in images" :key="i">
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
            {{ productData.name['en-US'] }}
          </h1>

          <div class="text-body-1" v-if="productData.description">
            {{ productData.description['en-US'] }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <Snackbar />
</template>
