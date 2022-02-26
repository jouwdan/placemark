import Mongoose from "mongoose";
const { Schema } = Mongoose;

const restaurantSchema = new Schema({
    Name: String,
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: [Number],
    },
    Description: String,
    Category: String,
});

export const Restaurant = Mongoose.model("Restaurant", restaurantSchema);