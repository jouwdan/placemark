import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const RestaurantSpec = Joi.object()
.keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  cuisine: Joi.string().required(),
  longitude: Joi.number(),
  latitude: Joi.number(),
  _id: IdSpec,
  __v: Joi.number(),
})
.label("RestaurantDetails");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");
export const RestaurantArray = Joi.array().items(RestaurantSpec).label("RestaurantArray");