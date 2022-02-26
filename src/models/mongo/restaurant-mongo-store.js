import { Restaurant } from "./restaurant.js"

export const restaurantMongoStore = {
    async getAllRestaurants() {
        const restaurants = await Restaurant.find().lean();
        return restaurants;
    },

    async getRestaurantById(id) {
        if (id) {
            const restaurant = await Restaurant.findOne({ _id: id}).lean();
            return restaurant;
        }
        return null;
    },

    async getRestaurantsByCategory(category) {
        const restaurants = await User.find({category: category}).lean();
        return restaurants;
    },

    async addRestaurant(reastaurant) {
        const newRestaurant = new Restaurant(restaurant);
        const restaurantObject = await newRestaurant.save();
        const r = await this.getRestaurantById(restaurantObject._id);
        return r;
    },

    async deleteRestaurantById(id) {
        try {
            await Restaurant.deleteOne({_id: id});
        } catch (error) {
            console.log("Invalid ID");
        }
    },

    async deleteAll() {
        await Restaurant.deleteMany({});
    }
};