import { dashboardController } from "./controllers/dashboard-controller.js";

export const webRoutes = [{ method: "GET", path: "/", config: dashboardController.index }];