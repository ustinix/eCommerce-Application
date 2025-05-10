import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type User } from '../types/user';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false);
  const user = ref<User | null>(null);
  const errorAuth = ref<string | null>(null);
  const token = ref<string | null>(null);

  const setUser = (email: string, password: string): void => {
    user.value = { email, password };
  };

  const setError = (error: string | null): void => {
    errorAuth.value = error;
  };
  const setAuth = (value: boolean): void => {
    isAuthenticated.value = value;
  };

  return { isAuthenticated, user, errorAuth, token, setUser, setError, setAuth };
});
