import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision"
import Cookie from "@hapi/cookie";
import Handlebars from "handlebars";
import path from "path";
import dotenv from "dotenv";
import Joi from "joi";
import Inert from "@hapi/inert";
import HapiSwagger from "hapi-swagger";
import jwt from "hapi-auth-jwt2";
import { validate } from "./api/jwt-utils.js";
import { fileURLToPath } from "url";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accountsController.js";
import { apiRoutes } from "./api-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  // process.exit(1);
}

const swaggerOptions = {
  info: {
    title: "Placemark API",
    version: "0.1",
  },
};

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    routes: { cors: true },
  });
  await server.register([
    Vision,
    Cookie,
    Inert,
    jwt,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  server.validator(Joi);
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookieName,
      password: process.env.cookiePassword,
      isSecure: false,
    },
    redirectTo: "/",
    validateFunc: accountsController.validate,
  });
  server.auth.strategy("jwt", "jwt", {
    key: process.env.cookiePassword,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] }
  });
  server.auth.default("session");
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });
  db.init("mongo");
  server.route(webRoutes);
  server.route(apiRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();