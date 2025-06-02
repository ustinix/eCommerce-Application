import { customRef } from 'vue';

export function debounceReference(value: string, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>;

  return customRef((track, trigger) => ({
    get(): string {
      track();
      return value;
    },
    set(newValue: string): void {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        value = newValue;
        trigger();
      }, delay);
    },
  }));
}
