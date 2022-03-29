import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";

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
  uploadImage: {
    handler: async function(request, h) {
      try {
        const Restaurant = await db.restaurantStore.getRestaurantById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          Restaurant.img = url;
          db.restaurantStore.updateRestaurant(Restaurant);
        }
        return h.redirect(`/restaurant/${Restaurant._id}`);
      } catch (err) {
        console.log(err);
        const Restaurant = await db.restaurantStore.getRestaurantById(request.params.id);
        return h.redirect(`/restaurant/${Restaurant._id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true
    }
  }
};