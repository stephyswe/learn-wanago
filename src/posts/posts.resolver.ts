import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequestWithUser } from '../authentication/auth.dto';
import { GraphqlJwtAuthGuard } from '../authentication/guard/gql-jwt.guard';
import { CreatePostInput } from './inputs/post.input';
import { Post } from './models/post.model';
import PostsService from './posts.service';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Query(() => [Post])
  async posts() {
    const posts = await this.postsService.getAllPosts();
    console.log(posts.items);
    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(@Args('input') createPostInput: CreatePostInput, @Context() context: { req: RequestWithUser }) {
    return this.postsService.createPost(createPostInput, context.req.user);
  }
}
