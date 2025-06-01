<script setup lang="ts">
import { defineProps } from 'vue';
import type { AddressWithId } from '../../types/address';

const address = defineProps<AddressWithId>();
</script>
<template>
  <p>{{ address.country }}</p>
</template>

<style lang="scss" scoped></style>
