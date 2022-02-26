import Joi from "joi";

export const UserSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};