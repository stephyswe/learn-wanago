import { Module } from '@nestjs/common';
import HealthController from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { PostsModule } from '../posts/posts.module';
import { ElasticsearchHealthIndicator } from './elasticsearchHealthIndicator';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TerminusModule, PostsModule, SearchModule],
  controllers: [HealthController],
  providers: [ElasticsearchHealthIndicator],
})
export default class HealthModule {}
