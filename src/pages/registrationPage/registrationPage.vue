<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const handleSubmit = () => {
  alert(`Регистрация с email: ${email.value}`);
};
</script>

<template>
  <div class="registration-page">
    <h1>Регистрация</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit">Зарегистрироваться</button>
    </form>
  </div>
</template>

<style scoped>
.registration-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

input,
button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
</style>
