import Boom from "@hapi/boom";
import bcrypt from "bcrypt";
import { db } from "../models/db.js";
import { User } from "../models/mongo/user.js";

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
  },
};