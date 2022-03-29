import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { Restaurant } from "../models/mongo/restaurant.js";
import { RestaurantSpec, RestaurantSpecPlus, RestaurantArray } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const restaurantApi = {
  create: {
    auth: false,
    handler: async function(request, h) {
      try {
        const restaurant = request.payload;
        if(await db.userStore.getRestaurantByName(restaurant.name)) {
            const errors = [];
            errors.push({message: "Restaurant Already Exists"});
            console.log(`Restaurant already exists: ${restaurant.name}`);
        };
        const newRestaurant = new Restaurant({
            name: restaurant.name,
            description: restaurant.description,
            category: restaurant.category,
            cuisine: restaurant.cuisine,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude
        });
        await db.restaurantStore.addRestaurant(newRestaurant);
      } catch (err) {
        return Boom.badImplementation("error creating restaurant");
      }
    },
    tags: ["api"],
    description: "Add a new Restaurant",
    notes: "Returns the newly created restaurant",
    validate: { payload: RestaurantSpec, failAction: validationError },
    response: { schema: RestaurantSpecPlus, failAction: validationError },
  },

  find: {
    auth: false,
    handler: async function(request, h) {
      try {
        const restaurants = await db.restaurantStore.getAllRestaurants();
        return restaurants;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all restaurants",
    notes: "Returns details of all restaurants",
    response: { schema: RestaurantArray, failAction: validationError },
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const restaurant = await db.restaurantStore.getRestaurantById(request.params.id);
        if (!restaurant) {
          return Boom.notFound("No Restaurant with this id");
        }
        return restaurant;
      } catch (err) {
        return Boom.serverUnavailable("No restaurant with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific restaurant",
    notes: "Returns restaurant details",
    response: { schema: RestaurantSpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.restaurantStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all restaurants",
    notes: "Delete all restaurants from Placemark",
  },
};