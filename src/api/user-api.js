import Boom from "@hapi/boom";
import bcrypt from "bcrypt";
import { db } from "../models/db.js";
import { User } from "../models/mongo/user.js";
import { UserSpec, UserArray } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const userApi = {
  create: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = request.payload;
        if(await db.userStore.getUserByEmail(user.email)) {
            const errors = [];
            errors.push({message: "User Already Exists"});
            console.log(`User already exists: ${user.email}`);
            return h.view("signup-view", {errors}).takeover().code(400);
        };
        const newUser = new User({
            email: user.email
        });
        newUser.password = newUser.generateHash(user.password);
        if(request.payload.role) {
            newUser.role = request.payload;
        } else {
            newUser.role = "User";
        }
        await db.userStore.addUser(newUser);
        if (user) {
          return h.response(user).code(201);
        }
      } catch (err) {
        return Boom.badImplementation("error creating user");
      }
    },
  },

  find: {
    auth: false,
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
    auth: false,
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
    response: { schema: UserSpec, failAction: validationError },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};