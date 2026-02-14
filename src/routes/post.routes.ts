import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { createPostSchema, likePostSchema } from '../validations/post.validation';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const postController = new PostController();

router.post('/', validate(createPostSchema), (req, res) => postController.createPost(req, res));
router.post('/:id/like', validate(likePostSchema), (req, res) => postController.likePost(req, res));
router.get('/feed', (req, res) => postController.getFeed(req, res));
router.get('/hashtag/:tag', (req, res) => postController.getPostsByHashtag(req, res))

export default router;