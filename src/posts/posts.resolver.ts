import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RequestWithUser } from '../authentication/auth.dto';
import { GraphqlJwtAuthGuard } from '../authentication/guard/gql-jwt.guard';
import User from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreatePostInput } from './inputs/post.input';
import { Post } from './models/post.model';
import PostsService from './posts.service';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private postsService: PostsService, private usersService: UsersService) {}

  @Query(() => [Post])
  async posts() {
    const posts = await this.postsService.getAllPosts();
    return posts.items;
  }

  @ResolveField('author', () => User)
  async author(@Parent() post: Post) {
    const { authorId } = post;
    console.log(authorId);
    return this.usersService.getById(authorId);
  }
}
