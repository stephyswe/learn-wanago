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
} from '@nestjs/common';
import PostsService from './posts.service';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import FindOneParams from '../utils/findOneParams';
import { RequestWithUser } from '../authentication/auth.dto';
import { PaginationParams } from '../utils/types/paginationParams';
import { HttpCacheInterceptor } from './httpCache.interceptor';
import { GET_POSTS_CACHE_KEY } from './postsCacheKey.constant';
import JwtTwoFactorGuard from '../authentication/guard/jwt-two-factor.guard';

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
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtTwoFactorGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @Patch(':id')
  async updatePost(@Param() { id }: FindOneParams, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}
