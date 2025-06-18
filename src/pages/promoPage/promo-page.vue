<script setup lang="ts">
import { AppNames } from '../../enums/app-names';
import { singPerсent } from '../../constants/constants';
import { getDiscountCodes } from '../../services/cart-service';
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import type { PromoCode } from '../../types/promo-code';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const promoCodes = ref<PromoCode[]>([]);
onMounted(async () => {
  try {
    const authStore = useAuthStore();
    promoCodes.value = await getDiscountCodes(authStore);
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="hero-discount" :class="{ 'theme-dark': isDark }">
    <h2 class="hero_title">{{ AppNames.promoTitle }}</h2>
  </div>
  <v-list lines="two" class="mt-4 promo-list" :class="{ 'theme-dark': isDark }">
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
          <v-chip size="small" class="mb-1"> {{ promo.discount }}{{ singPerсent }}</v-chip>
          <span class="text-caption text-grey"> before {{ promo.expires }} </span>
        </div>
      </template>
    </v-list-item>
  </v-list>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
@use '../../assets/styles/variables.scss' as v;
.hero-discount {
  @include hero-section('../../assets/images/promo-page.png');
  &.theme-dark {
    background-color: v.$color-background-dark;
  }
}
.promo-list {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;

  &.theme-dark {
    background-color: v.$color-background-dark;

    :deep(.v-list-item) {
      color: v.$color-white;

      .v-list-item__title,
      .v-list-item__subtitle {
        color: v.$color-white;
      }
    }
  }
}
:deep(.v-list-item) {
  border-bottom: 1px solid v.$color-lightgray;

  .theme-dark & {
    border-bottom: 1px solid v.$color-white;
  }
}
</style>
