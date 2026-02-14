import { Request, Response } from 'express';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private postRepository = AppDataSource.getRepository(Post);
  

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const user = await this.userRepository.findOneBy({
        id: userId,
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = this.userRepository.create(req.body);
      const result = await this.userRepository.save(user);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const user = await this.userRepository.findOneBy({
        id: userId,
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      this.userRepository.merge(user, req.body);
      const result = await this.userRepository.save(user);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const result = await this.userRepository.delete(userId);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }

  async followUser(req: Request, res: Response) {
    try {
      const followerId = parseInt(req.body.followerId);
      const targetId = parseInt(req.params.id);
      
      if (isNaN(followerId) || isNaN(targetId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      if (followerId === targetId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }

      const follower = await this.userRepository.findOne({ 
        where: { id: followerId }, 
        relations: ['following'] 
      });
      const target = await this.userRepository.findOneBy({ id: targetId });

      if (!follower || !target) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!follower.following.some(u => u.id === target.id)) {
        follower.following.push(target);
        await this.userRepository.save(follower);
      }

      res.json({ message: `Successfully followed user ${targetId}` });
    }catch (error) {
      res.status(500).json({ message: 'Error following user', error });
    }
  }

  // additional feautres like get user's followers, view user activity history
  async getFollowers(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const limit = Math.max(1, Number(req.query.limit) || 10);
      const offset = Math.max(0, Number(req.query.offset) || 0);

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['followers'],
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      const totalCount = user.followers.length;
      const paginatedFollowers = user.followers.slice(offset, offset + limit);

      res.json({
        followers: paginatedFollowers,
        totalFollowerCount: totalCount
      });
    }catch (error) {
      res.status(500).json({ message: 'Error fetching followers', error });
    }
  }

  async getActivity(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const limit = Math.max(1, Number(req.query.limit) || 10);
      const offset = Math.max(0, Number(req.query.offset) || 0);
      const typeFilter = req.query.type as string | undefined;
      
      const posts = await this.postRepository.find({
        where: { user: { id: userId } },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });

      const likedPosts = await this.postRepository.find({
        where: { likes: { id: userId } },
        relations: ['user'],
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { 
            id: true,
            username: true }
        }
      });
      let activities = [
        ...posts.map(p => ({ 
          type: 'POST_CREATED', 
          timestamp: p.createdAt, 
          description: `Created a post: "${p.content.substring(0, 20)}..."` 
        })),
        ...likedPosts.map(lp => ({ 
          type: 'LIKE_GIVEN', 
          timestamp: lp.createdAt, 
          description: `Liked a post by ${lp.user.username}` 
        }))
      ];

      if (typeFilter) {
        activities = activities.filter(a => a.type === typeFilter);
      }

      const sortedActivities = activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(offset, offset + limit);

      res.json({ 
        activities: sortedActivities,
        total: activities.length,
        limit,
        offset 
      });
    
    }catch (error) {
      res.status(500).json({ message: 'Error fetching activity history', error });
    }
  }
}
