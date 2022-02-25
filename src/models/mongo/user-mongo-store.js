import { User } from "./user.js"

export const userMongoStore = {
    async getAllUsers() {
        const users = await User.find().lean();
        return users;
    },

    async getUserById(id) {
        if (id) {
            const user = await User.findOne({ _id: id}).lean();
            return user;
        }
        return null;
    },

    async getUserByEmail(email) {
        const user = await User.findOne({email: email}).lean();
        return user;
    },

    async addUser(user) {
        const newUser = new User(user);
        const userObject = await newUser.save();
        const u = await this.getUserById(userObject._id);
        return u;
    },

    async deleteUserById(id) {
        try {
            await User.deleteOne({_id: id});
        } catch (error) {
            console.log('Invalid ID');
        }
    },

    async deleteAll() {
        await User.deleteMany({});
    }
};