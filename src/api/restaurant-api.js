import fs from 'fs';
import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { Restaurant } from "../models/mongo/restaurant.js";
import { RestaurantSpec, RestaurantSpecPlus, RestaurantArray } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";
import { imageStore } from "../models/image-store.js";

export const restaurantApi = {
  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const restaurant = request.payload;
      if(await db.restaurantStore.getRestaurantByName(restaurant.name)) {
        return Boom.unauthorized("Restaurant already exists");
      };
      const newRestaurant = new Restaurant({
          name: restaurant.name,
          description: restaurant.description,
          category: restaurant.category,
          cuisine: restaurant.cuisine,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude
      });
      try {
        const addNewRestaurant = await db.restaurantStore.addRestaurant(newRestaurant);
        if(addNewRestaurant) {
          return h.response(addNewRestaurant).code(201);
        };
        return Boom.badImplementation("Error creating restaurant");
      } catch (err) {
        return Boom.badImplementation("Database error");
      };
    },
    tags: ["api"],
    description: "Add a new Restaurant",
    notes: "Returns the newly created restaurant",
    validate: { payload: RestaurantSpec, failAction: validationError },
    response: { schema: RestaurantSpecPlus, failAction: validationError },
  },

  find: {
    auth: {
      strategy: "jwt",
    },
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
    auth: {
      strategy: "jwt",
    },
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
    auth: {
      strategy: "jwt",
    },
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

  uploadImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      console.log('uploadImage initiated')
      try {
        const Restaurant = await db.restaurantStore.getRestaurantById(request.params.id);
        if (request.payload) {
          let str = JSON.stringify(await request.payload.data).toString();
          const stringifiedImage = str.replaceAll('"', '');
          console.log(stringifiedImage)
          console.log('uploading image to ' + Restaurant.name);
          let url = await imageStore.uploadBase64Image(stringifiedImage);
          console.log(url)
          Restaurant.img = url;
          const dbUpdate = await db.restaurantStore.updateRestaurant(Restaurant);
          return h.response(dbUpdate).code(201);
        }
        return Boom.serverUnavailable("Error");
      } catch (err) {
        console.log(err)
        return Boom.serverUnavailable("Error");
      }
    },
    payload: {
      multipart: true,
      output: "file",
      maxBytes: 209715200,
    }
  },

  deleteImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      console.log('deleteImage initiated')
      try {
        const Restaurant = await db.restaurantStore.getRestaurantById(request.params.id);
        var filename = Restaurant.img.split('/').pop();
        var fileid = filename.substring(0, filename.lastIndexOf('.')) || filename;
        console.log('deleting image ' + fileid)
        if (Restaurant) {
          await imageStore.deleteImage(fileid);
          Restaurant.img = "delete";
          const dbUpdate = await db.restaurantStore.updateRestaurant(Restaurant);
          return h.response(dbUpdate).code(201);
        }
        return Boom.serverUnavailable("Error");
      } catch (err) {
        console.log(err)
        return Boom.serverUnavailable("Error");
      }
    },
  },
};