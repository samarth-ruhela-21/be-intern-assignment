import { Request, Response } from 'express';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Hashtag } from '../entities/Hashtag';
import { AppDataSource } from '../data-source';

export class PostController {
  private postRepository = AppDataSource.getRepository(Post);
  private userRepository = AppDataSource.getRepository(User);
  private hashtagRepository = AppDataSource.getRepository(Hashtag);

    async createPost(req: Request, res: Response) {
        try {
            const { content, userId } = req.body;

            // Validating User
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Extracting Hashtags from Content
            const hashtagNames = content.match(/#\w+/g) || [];
            const hashtags: Hashtag[] = [];

            for (const name of hashtagNames) {
                const cleanName = name.substring(1).toLowerCase();
                let hashtag = await this.hashtagRepository.findOneBy({ name: cleanName });
                if (!hashtag) {
                    hashtag = this.hashtagRepository.create({ name: cleanName });
                    await this.hashtagRepository.save(hashtag);
                }
                hashtags.push(hashtag);
            }

            // Creating the Post
            const post = this.postRepository.create({
                content,
                user,
                hashtags
            });

            const result = await this.postRepository.save(post);
            res.status(201).json(result);
        }catch (error) {
                res.status(500).json({ message: 'Error creating post', error });
        }
    }

    async likePost(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.id);
            const { userId } = req.body;

            const post = await this.postRepository.findOne({
              where: { id: postId },
              relations: ['likes']
            });
            const user = await this.userRepository.findOneBy({ id: userId });
                
            if (!post || !user) {
              return res.status(404).json({ message: "Post or User not found" });
            }

        const alreadyLiked = post.likes.some(u => u.id === user.id);

        if(alreadyLiked) {
            post.likes = post.likes.filter(u => u.id !== user.id);
        }else {
            post.likes.push(user);
        }

        await this.postRepository.save(post);
        res.json({ message: alreadyLiked ? "Post unliked" : "Post liked" });
        } catch (error) {
            res.status(500).json({ message: 'Error toggling like', error });
        }
    }

  // additional feautres like api/feed

    async getFeed(req: Request, res: Response) {
        try {
            const userId = Number(req.query.userId);
            const limit = Number(req.query.limit) || 10;
            const offset = Number(req.query.offset) || 0;

            const currentUser = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['following']
            });

            const followingIds = currentUser?.following.map(u => u.id) || [];

            const [posts, total] = await this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.user', 'user')
                .leftJoinAndSelect('post.hashtags', 'hashtag')
                .loadRelationCountAndMap('post.likeCount', 'post.likes')
                .select(['post', 'user.id', 'user.username', 'hashtag']) 
                .where('post.user.id IN (:...ids)', { ids: followingIds.length ? followingIds : [0] })
                .orderBy('post.createdAt', 'DESC')
                .take(limit)
                .skip(offset)
                .getManyAndCount();

                res.json({ 
                    posts, 
                    total, 
                    limit, 
                    offset,
                    hasMore: offset + limit < total // Helpful for the frontend
                });
        }catch (error) {
            res.status(500).json({ message: 'Error fetching feed', error });
        }
    }
    
    async getPostsByHashtag(req: Request, res: Response) {
        try {
            const { tag } = req.params;
            const { limit = 10, offset = 0 } = req.query;

            const [posts, total] = await this.postRepository.createQueryBuilder('post')
                .innerJoin('post.hashtags', 'hashtag')
                .leftJoinAndSelect('post.user', 'user')
                .loadRelationCountAndMap('post.likeCount', 'post.likes')
                .where('LOWER(hashtag.name) = LOWER(:tag)', { tag })
                .take(Number(limit))
                .skip(Number(offset))
                .getManyAndCount();

            res.json({ posts, total });
        }catch (error) {
                res.status(500).json({ message: 'Error fetching hashtag posts', error });
        }
    }     
}