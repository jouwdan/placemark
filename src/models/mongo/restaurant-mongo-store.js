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

    async getRestaurantByName(nameInput) {
        const restaurant = await Restaurant.findOne({name: nameInput}).lean();
        return restaurant;
    },

    async getRestaurantsByCategory(categoryInput) {
        const restaurants = await Restaurant.find({category: categoryInput}).lean();
        return restaurants;
    },

    async getRestaurantsByCuisine(cuisineInput) {
        const restaurants = await Restaurant.find({cuisine: cuisineInput}).lean();
        return restaurants;
    },
    
    async addRestaurant(restaurant) {
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
    },

    async updateRestaurant(updatedRestaurant) {
        const selectedRestaurant = await Restaurant.findOne({ _id: updatedRestaurant._id });
        selectedRestaurant.title = updatedRestaurant.title;
        selectedRestaurant.img = updatedRestaurant.img;
        await selectedRestaurant.save();
      },
};