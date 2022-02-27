import Mongoose from "mongoose";

const { Schema } = Mongoose;

const restaurantSchema = new Schema({
    name: String,
    description: String,
    category: String,
    cuisine: String,
    location: {
        type: {
            type: String,
            enum: 'Point',
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
});

export const Restaurant = Mongoose.model("Restaurant", restaurantSchema);