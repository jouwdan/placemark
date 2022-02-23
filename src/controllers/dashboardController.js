import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const viewData = {
        title: "Placemark Dashboard",
      };
      return h.view("dashboard-view", viewData);
    },
  },
};