import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { restaurantMongoStore } from "./mongo/restaurant-mongo-store.js";

export const db = {
  userStore: null,
  restaurantStore: null,

  init(storeType) {
    this.userStore = userMongoStore;
    this.restaurantStore = restaurantMongoStore;
    connectMongo();
  },
};