import { userMemStore } from "./mem/user-mem-store.js";

export const db = {
  userStore: null,

  init() {
    this.userStore = userMemStore;
  },
};