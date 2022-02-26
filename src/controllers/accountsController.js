import { db } from "../models/db.js";
import { User } from "../models/mongo/user.js";
import { UserSpec, } from "../models/joi-schemas.js";
import bcrypt from "bcrypt";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Placemark" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Placemark" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      if(db.userStore.getUserByEmail(user.email)) {
        let errors = [];
        errors.push({message: "User Already Exists"});
        console.log('User already exists: ' + user.email);
        return h.view("signup-view", {errors}).takeover().code(400);
      };
      var new_user = new User({
        email: user.email
      });
      new_user.password = new_user.generateHash(user.password);
      await db.userStore.addUser(new_user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Placemark" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email, password);
      if (!user) {
        let errors = [];
        errors.push({message: "Invalid User"});
        console.log({errors});
        return h.view("login-view", {errors}).takeover().code(400);
      }
      const match = await bcrypt.compare(password, user.password);
      if(!match) {
        let errors = [];
        errors.push({message: "Invalid password"});
        console.log({errors});
        return h.view("login-view", {errors}).takeover().code(400);
      }
      console.log('logging in as ' + email);
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    auth: false,
    handler: function (request, h) {
      return h.redirect("/");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { valid: false };
    }
    return { valid: true, credentials: user };
  },
};