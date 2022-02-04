import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { RequestWithUser } from '../authentication/auth.dto';
import { GraphqlJwtAuthGuard } from '../authentication/guard/gql-jwt.guard';
import { User } from '../users/model/user.model';
import { CreatePostInput } from './inputs/post.input';
import { Post } from './models/post.model';
import PostsService from './posts.service';
import PostsLoaders from './loaders/posts.loaders';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from '../pubSub/pubSub.module';

const POST_ADDED_EVENT = 'postAdded';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    private postsLoaders: PostsLoaders,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Query(() => [Post])
  async posts() {
    const posts = await this.postsService.getAllPosts();
    return posts.items;
  }

  @ResolveField('author', () => User)
  async getAuthor(@Parent() post: Post) {
    const { authorId } = post;

    return this.postsLoaders.batchAuthors.load(authorId);
  }

  @Subscription(() => Post)
  postAdded() {
    return this.pubSub.asyncIterator(POST_ADDED_EVENT);
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(@Args('input') createPostInput: CreatePostInput, @Context() context: { req: RequestWithUser }) {
    const newPost = await this.postsService.createPost(createPostInput, context.req.user);
    this.pubSub.publish(POST_ADDED_EVENT, { postAdded: newPost });
    return newPost;
  }
}
