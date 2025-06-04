<script setup lang="ts">
import type { Image } from '@commercetools/platform-sdk';
const props = defineProps<{ images: Image[]; onClick?: () => void }>();
function handleClick(): void {
  if (props.onClick) {
    props.onClick();
  }
}
const showArrows = (): boolean => props.images.length > 1;
</script>

<template>
  <v-carousel
    hide-delimiter-background
    :show-arrows="showArrows()"
    height="400"
    cycle
    class="mb-6 rounded-lg"
  >
    <v-carousel-item v-for="(img, i) in props.images" :key="i">
      <v-img
        :src="img.url"
        :style="{ objectFit: 'contain' }"
        width="100%"
        height="100%"
        class="rounded-lg"
        @click="handleClick()"
      />
    </v-carousel-item>
  </v-carousel>
</template>
<style lang="scss" scoped></style>
