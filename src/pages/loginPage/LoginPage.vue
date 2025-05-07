<script setup lang="ts">
import { ref } from 'vue';
const email = ref<string>('');
const password = ref<string>('');
const errorEmail = ref<string>('');
const errorPassword = ref<string>('');
const showPassword = ref<boolean>(false);

const togglePassword = ():void => {
  showPassword.value = !showPassword.value;
};
function login(event: Event): void {
  event.preventDefault();
  console.log('login');
}
</script>

<template>  
  <div class="hero overlay">
    <h2 class="hero_title">My Account</h2>
  </div>
  <form class="login_form">
    <label class="login_label">Email address <span class="primary_color">*</span> </label>
    <input class="login_input" v-model="email" type="email" placeholder="Email" />
    <p class="login_error" :class="{ visible: !!errorEmail }">{{ errorEmail }}</p>
    <label class="login_label">Password <span class="primary_color">*</span> </label>
    <div class="password_wrapper">
      <input
        :type="showPassword ? 'text' : 'password'"
        v-model="password"
        placeholder="Password"
        class="password_input"
      />
      <button type="button" class="toggle-button" @click="togglePassword"></button>
    </div>
    <p class="login_error" :class="{ visible: !!errorPassword }">{{ errorPassword }}</p>
    <button type="submit" @click="login" class="login_button">LOG IN</button>
  </form>
</template>
<style lang="scss" scoped>
@import './style.scss';
</style>
