import Joi from 'joi';

export const createPostSchema = Joi.object({
  userId: Joi.number().required().messages({
    'any.required': 'User ID is required to create a post',
  }),
  content: Joi.string().required().min(1).max(2000).messages({
    'string.empty': 'Post content cannot be empty',
    'string.max': 'Post content is too long',
  }),
});

export const likePostSchema = Joi.object({
  userId: Joi.number().required().messages({
    'any.required': 'User ID is required to like a post',
  }),
});