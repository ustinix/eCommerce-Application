<script setup lang="ts">
import { AppNames } from '../../enums/app-names';
import { promoCodes } from '../../constants/constants';
</script>

<template>
  <div class="hero-discount">
    <h2 class="hero_title">{{ AppNames.promoTitle }}</h2>
  </div>
  <v-list lines="two" class="mt-4">
    <v-list-item
      v-for="(promo, index) in promoCodes"
      :key="index"
      :title="promo.code"
      :subtitle="promo.description"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-tag" color="green"></v-icon>
      </template>

      <template v-slot:append>
        <div class="d-flex flex-column align-end">
          <v-chip :color="promo.active ? 'green' : 'grey'" size="small" class="mb-1">
            {{ promo.discount }}%
          </v-chip>
          <span class="text-caption text-grey"> before {{ promo.expires }} </span>
        </div>
      </template>
    </v-list-item>
  </v-list>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
.hero-discount {
  @include hero-section('../../assets/images/promo-page.png');
}
.v-list {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
