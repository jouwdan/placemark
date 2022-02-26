import Mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = Mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

export const User = Mongoose.model("User", userSchema);