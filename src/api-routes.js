import { userApi } from "./api/user-api.js";
import { restaurantApi } from "./api/restaurant-api.js";

export const apiRoutes = [
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },

  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  
  { method: "POST", path: "/api/restaurants", config: restaurantApi.create },
  { method: "GET", path: "/api/restaurants", config: restaurantApi.find },
  { method: "DELETE", path: "/api/restaurants", config: restaurantApi.deleteAll },
  { method: "GET", path: "/api/restaurants/{id}", config: restaurantApi.findOne },
  { method: "POST", path: "/api/restaurants/{id}/uploadimage", config: restaurantApi.uploadImage },
  { method: "POST", path: "/api/restaurants/{id}/deleteimage", config: restaurantApi.deleteImage },
];