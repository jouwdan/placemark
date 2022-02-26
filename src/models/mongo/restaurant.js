import Mongoose from "mongoose";

const { Schema } = Mongoose;

const restaurantSchema = new Schema({
    name: String,
    location: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: [Number],
        required: true
    },
    description: String,
    category: String,
});

export const Restaurant = Mongoose.model("Restaurant", restaurantSchema);