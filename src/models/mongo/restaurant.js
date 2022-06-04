import Mongoose from "mongoose";

const { Schema } = Mongoose;

const restaurantSchema = new Schema({
    name: String,
    description: String,
    img: String,
    category: String,
    cuisine: String,
    longitude: String,
    latitude: String
});

export const Restaurant = Mongoose.model("Restaurant", restaurantSchema);