import Mongoose from "mongoose";

const { Schema } = Mongoose;

const restaurantSchema = new Schema({
    name: String,
    description: String,
    img: String,
    category: String,
    cuisine: String,
    longitude: 'Number',
    latitude: 'Number'
});

export const Restaurant = Mongoose.model("Restaurant", restaurantSchema);