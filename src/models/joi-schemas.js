import Joi from "joi";

export const UserSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const RestaurantSpec = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
};