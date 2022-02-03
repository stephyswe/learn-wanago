import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../users/model/user.model';
import { UsersService } from '../users/users.service';
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
  async getAuthor(@Parent() post: Post) {
    const { authorId } = post;

    return this.usersService.getById(authorId);
  }
}
