import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserSpec = Joi.object()
  .keys({
    firstName: Joi.string().example("Homer"),
    lastName: Joi.string().example("Simpson"),
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
    _id: IdSpec,
    __v: Joi.number(),
  })
  .label("UserDetails");

export const RestaurantSpec = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
};

export const UserArray = Joi.array().items(UserSpec).label("UserArray");