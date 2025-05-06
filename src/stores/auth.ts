import { defineStore } from 'pinia';
import { ref } from 'vue'
import {type User} from '../types/user';

export const useAuthStore = defineStore('auth', () => {
    const  isAuthenticated = ref<boolean>(false);
    const user = ref<User | null>(null);
    const error = ref<string | null>(null)
    return { isAuthenticated, user, error}
  });