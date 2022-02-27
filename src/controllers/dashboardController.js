import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const restaurants = await db.restaurantStore.getAllRestaurants();
      const viewData = {
        title: "Placemark Dashboard",
        restaurants: restaurants,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addRestaurant: {
    handler: async function (request, h) {
      const newRestaurant = request.payload;
      await db.restaurantStore.addRestaurant(newRestaurant);
      return h.redirect("/dashboard");
    },
  },
};