import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from '../../users/user.entity';
import { Entity, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [String])
  paragraphs: string[];

  @Field(() => Int)
  authorId: number;

  @Field((type) => [User], { nullable: true })
  @OneToMany((type) => User, (user) => user.posts)
  author: User[];
}
