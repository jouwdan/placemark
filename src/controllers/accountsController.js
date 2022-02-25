import { db } from "../models/db.js";
import { User } from "../models/mongo/user.js";
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
    handler: async function (request, h) {
      const user = request.payload;
      if(db.userStore.getUserByEmail(user.email)) {
        console.log('User already exists: ' + user.email);
        return h.redirect("/signup");
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
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email, password);
      if (!user) {
        console.log('invalid user: ' + email);
        return h.redirect("/login");
      }
      const match = await bcrypt.compare(password, user.password);
      if(!match) {
        console.log('invalid password entered for user: ' + email);
        return h.redirect("/login");
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