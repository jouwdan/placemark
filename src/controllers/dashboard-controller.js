export const dashboardController = {
    index: {
      handler: async function (request, h) {
        return h.view("main");
      },
    },
  };