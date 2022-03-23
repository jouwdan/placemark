import { accountsController } from "./controllers/accountsController.js";
import { dashboardController } from "./controllers/dashboardController.js";
import { restaurantController } from "./controllers/restaurantController.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "GET", path: "/restaurant/{id}", config: restaurantController.index },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },

  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  { method: "POST", path: "/dashboard/addrestaurant", config: dashboardController.addRestaurant },
];