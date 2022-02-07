import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  CacheKey,
  CacheTTL,
  ParseIntPipe,
} from '@nestjs/common';
import PostsService from './posts.service';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { RequestWithUser } from '../authentication/auth.dto';
import { PaginationParams } from '../utils/types/paginationParams';
import { HttpCacheInterceptor } from './httpCache.interceptor';
import { GET_POSTS_CACHE_KEY } from './postsCacheKey.constant';
import JwtTwoFactorGuard from '../authentication/guard/jwt-two-factor.guard';
import RoleGuard from '../users/role.guard';
import Role from '../users/role.enum';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  @UseGuards(JwtTwoFactorGuard)
  async getPosts(@Query('search') search: string, @Query() { offset, limit, startId }: PaginationParams) {
    if (search) {
      return this.postsService.searchForPosts(search, offset, limit, startId);
    }
    return this.postsService.getPostsWithAuthors(offset, limit, startId);
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(JwtTwoFactorGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @Patch(':id')
  async updatePost(@Param('id', ParseIntPipe) id: number, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(id, post);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
