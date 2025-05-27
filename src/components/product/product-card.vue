<script setup lang="ts">
import { computed, ref } from 'vue';
import { categoriesId, Errors } from '../../assets/constants';

const buttonTextAdd = 'Add to Cart';
const selectText = 'Select size';
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['add-to-cart']);

const sizes = computed(() => {
  const categoryId = props.product.categories?.[0]?.id;
  const category = categoriesId.find(cat => cat.id === categoryId);

  return category?.sizes || ['One Size'];
});
const selectedSize = ref(sizes.value[0]);

const addToCart = () => {
  emit('add-to-cart', {
    productId: props.product.id,
    size: selectedSize.value,
  });
};

const dollarSing = '$';
const formatPrice = (price: number) => {
  return `${dollarSing}${(price / 100).toFixed(2)}`;
};
</script>
<template>
  <v-card class="product-card" width="296">
    <v-img
      :src="product.masterVariant.images?.[0]?.url || 'https://via.placeholder.com/296x400'"
      :alt="product.name?.['en-US']"
      height="400"
      cover
    ></v-img>

    <v-card-title class="d-flex align-center px-4 pt-4 pb-2">
      <h3 class="text-h6">{{ product.name?.['en-US'] }}</h3>
      <v-spacer></v-spacer>
      <span class="text-h6">
        {{
          product.masterVariant.prices?.[0]?.value?.centAmount
            ? formatPrice(product.masterVariant.prices[0].value.centAmount)
            : 'N/A'
        }}
      </span>
    </v-card-title>

    <v-card-text class="px-4 py-2 text-body-2">
      {{ product.description?.['en-US'] || Errors.ProductDescription }}
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-text class="px-4 py-2">
      <span class="subheading">{{ selectText }}</span>
      <v-chip-group v-model="selectedSize" selected-class="text-primary" mandatory class="mt-2">
        <v-chip v-for="size in sizes" :key="size" :value="size" variant="outlined" size="small">
          {{ size }}
        </v-chip>
      </v-chip-group>
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn color="primary" variant="flat" block @click="addToCart"> {{ buttonTextAdd }} </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.product-card {
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
}

.v-card-title {
  word-break: break-word;
}

.v-card-text {
  flex-grow: 1;
}
</style>
