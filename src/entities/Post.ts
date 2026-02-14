import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { User } from "./User";
import { Hashtag } from "./Hashtag";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToMany(() => User)
  @JoinTable({ name: "post_likes" }) 
  likes: User[];

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts)
  @JoinTable({ name: "post_hashtags" }) 
  hashtags: Hashtag[];
}