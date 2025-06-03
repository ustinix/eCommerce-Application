<script setup lang="ts">
import { onMounted } from 'vue';
import { getProductById } from '../../services/product-service';

const { id } = defineProps<{ id: string }>();

onMounted(async () => {
  try {
    const response = await getProductById(id);
    console.log(response);
  } catch (error) {
    console.error('Failed to fetch product', error);
    return null;
  }
});
</script>
<template>
  <div class="product-card">
    <p>Product ID: {{ id }}</p>
  </div>
</template>
