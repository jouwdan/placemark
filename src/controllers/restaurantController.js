import { db } from "../models/db.js";

export const restaurantController = {
  index: {
    handler: async function (request, h) {
      const restaurant = await db.restaurantStore.getRestaurantById(request.params.id);
      const viewData = {
        title: restaurant.name,
        restaurant: restaurant,
      };
      return h.view("restaurant-view", viewData);
    },
  },
};