<script setup lang="ts">
import { Labels } from '../../assets/constants';
import type { UserProfile } from '../../types/user-profile';

const { profile } = defineProps<{
  profile: UserProfile;
}>();
</script>
<template v-if="profile">
  <p>
    <span class="label">{{ Labels.labelName }}</span> {{ profile.firstName }}
  </p>
  <p>
    <span class="label">{{ Labels.labelSurname }}</span> {{ profile.lastName }}
  </p>
  <p>
    <span class="label">{{ Labels.labelDate }}</span> {{ profile.dateOfBirth }}
  </p>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;

.label {
  font-weight: 600;
}
</style>
