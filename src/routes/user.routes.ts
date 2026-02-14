import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createUserSchema, followUserSchema, updateUserSchema } from '../validations/user.validation';
import { UserController } from '../controllers/user.controller';


export const userRouter = Router();
const userController = new UserController();

// Get all users
userRouter.get('/', userController.getAllUsers.bind(userController));

// Get user by id
userRouter.get('/:id', userController.getUserById.bind(userController));

// Create new user
userRouter.post('/', validate(createUserSchema), userController.createUser.bind(userController));

// Update user
userRouter.put('/:id', validate(updateUserSchema), userController.updateUser.bind(userController));

// Delete user
userRouter.delete('/:id', userController.deleteUser.bind(userController));

// get user followers
userRouter.get('/:id/followers', userController.getFollowers.bind(userController));

// View user activity history
userRouter.get('/:id/activity', userController.getActivity.bind(userController));

// Follow a user (Assuming you use the controller method we wrote earlier)
userRouter.post('/:id/follow', validate(followUserSchema),userController.followUser.bind(userController));

export default userRouter;