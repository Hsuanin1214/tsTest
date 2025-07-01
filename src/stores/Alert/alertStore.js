// stores/alertStore.js
import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    show: false,
    type: 'info', // 'info' | 'success' | 'error' | 'warning',
    showButton: false,
    message: '',
    timeoutId: null // null | ReturnType<typeof setTimeout>
  }),
  actions: {
    trigger({ type = 'info', showButton = false, message = '', duration = 3000 }) {
      this.type = type;
      this.showButton = showButton;
      this.message = message;
      this.show = true;

      if (duration > 0) {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.close(), duration);
      }
    },
    close() {
      this.show = false;
      this.showButton = false;
      this.customContent = null;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
  }
});
