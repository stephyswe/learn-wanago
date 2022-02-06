import {
    HealthIndicatorResult,
    HealthIndicator,
    HealthCheckError,
  } from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import PostsService from './posts.service';

@Injectable()
export class PostsHealthIndicator extends HealthIndicator {
  constructor(private readonly postsService: PostsService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const posts = await this.postsService.getAllPosts();
    const isHealthy = posts.items.length !== 0;

    const result = this.getStatus(key, isHealthy, { posts: posts.items.length });

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('PostsCheck failed', result);
  }
}