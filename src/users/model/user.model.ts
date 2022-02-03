import { Field, Int, ObjectType } from '@nestjs/graphql';
import Post from '../../posts/post.entity';
import { ManyToOne } from 'typeorm';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field((type) => Post)
  @ManyToOne((type) => Post, (post) => post.author)
  posts: Post[];
}
