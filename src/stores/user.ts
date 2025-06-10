import { defineStore } from 'pinia';
import type { UserProfile } from '../types/user-profile';
import { ref, watch } from 'vue';

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null);

  // localStorage
  const saved = localStorage.getItem('userStore');
  if (saved) {
    const parsed = JSON.parse(saved);
    profile.value = parsed.profile ?? null;
  }

  // save in localStorage
  watch(
    profile,
    newProfile => {
      localStorage.setItem(
        'userStore',
        JSON.stringify({
          profile: newProfile,
        }),
      );
    },
    { deep: true },
  );

  const setUserProfile = (data: UserProfile | null): void => {
    profile.value = data;
  };

  return {
    profile,
    setUserProfile,
  };
});
