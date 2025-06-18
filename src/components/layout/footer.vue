<template>
  <v-footer class="text-center d-flex flex-column ga-2 py-4" :class="{ 'theme-dark': isDark }">
    <v-divider
      class="my-2"
      thickness="2"
      :color="isDark ? 'white' : 'black'"
      width="250"
    ></v-divider>
    <div class="d-flex ga-3">
      <v-btn
        v-for="link in socialLinks"
        :key="link.icon"
        :icon="link.icon"
        :href="link.url"
        target="_blank"
        density="comfortable"
        variant="text"
        :color="isDark ? 'white' : 'black'"
        rel="noopener noreferrer"
      ></v-btn>
      <a :href="rs.url" target="_blank" class="rs-icon-link">
        <img :src="rsIcon" :alt="rs.title" class="rs-icon" :class="{ 'invert-icon': isDark }" />
      </a>
    </div>

    <v-divider
      class="my-2"
      thickness="2"
      :color="isDark ? 'white' : 'black'"
      width="50"
    ></v-divider>

    <div
      class="text-caption font-weight-regular opacity-60"
      :class="isDark ? 'text-white' : 'text-grey-darken-1'"
    >
      {{ FooterText }}
    </div>

    <v-divider :color="isDark ? 'white' : 'black'"></v-divider>

    <div :class="isDark ? 'text-white' : 'text-black'">
      {{ getDate() }} — <strong>{{ AppNames.AppName }}</strong>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
import rsIcon from '../../assets/images/rs_school_js.svg';
import { AppNames } from '../../enums/app-names';
import { FooterText, socialLinks, rs } from '../../constants/constants';
import { getDate } from '../../utils/get-date';
import { useTheme } from 'vuetify';
import { computed } from 'vue';

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
</script>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;

.v-footer {
  &.theme-dark {
    background-color: #1e1e1e;
  }
}
.v-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.8;
    color: v.$color-hover;
  }
}
.rs-icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  .rs-icon {
    width: 40px;
    height: 40px;
    &.invert-icon {
      filter: invert(1) brightness(2);
    }
  }

  &:hover {
    transform: translateY(-2px);
    opacity: 0.8;
    color: v.$color-hover;
  }
}
@media (max-width: 600px) {
  .rs-icon-link {
    width: 36px;
    height: 36px;
    .rs-icon {
      width: 22px;
      height: 22px;
    }
  }
}
</style>
