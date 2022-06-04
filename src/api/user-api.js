import Boom from "@hapi/boom";
import bcrypt from "bcrypt";
import { db } from "../models/db.js";
import { User } from "../models/mongo/user.js";
import { UserSpec, UserSpecPlus, IdSpec, UserArray } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";
import { createToken } from "./jwt-utils.js";

export const userApi = {
  authenticate: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await db.userStore.getUserByEmail(request.payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        };
        if(await bcrypt.compare(request.payload.password, user.password)) {
          const token = createToken(user);
          return h.response({ success: true, token: token }).code(201);
        };
        if(err) {
          return Boom.unauthorized("Invalid password");
        };
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    }
  },
  create: {
    auth: false,
    handler: async function(request, h) {
      const user = request.payload;
      if(await db.userStore.getUserByEmail(user.email)) {
        return Boom.unauthorized("User already exists");
      };
      const newUser = new User({
        email: user.email
      });
      newUser.password = newUser.generateHash(user.password);
      if(request.payload.role) {
        newUser.role = request.payload;
      } else {
        newUser.role = "User";
      };
      try {
        const addNewUser = await db.userStore.addUser(newUser);
        if (addNewUser) {
          return h.response(addNewUser).code(201);
        };
        return Boom.badImplementation("error creating user");
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        };
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    validate: { payload: UserSpec, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        const users = await db.userStore.getAllUsers();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all users",
    notes: "Returns details of all users",
    response: { schema: UserArray, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
    notes: "Delete all users from Placemark",
  },
};