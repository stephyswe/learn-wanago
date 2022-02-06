import { Controller, Get } from '@nestjs/common';
import { RedisOptions, Transport } from '@nestjs/microservices';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { PostsHealthIndicator } from '../posts/posts.health';
import { ElasticsearchHealthIndicator } from './elasticsearchHealthIndicator';

@Controller('health')
class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private postsHealthIndicator: PostsHealthIndicator,
    private elasticsearchHealthIndicator: ElasticsearchHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.postsHealthIndicator.isHealthy('posts'),
      () =>
        this.microservice.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
        }),
      () => this.typeOrmHealthIndicator.pingCheck('database'),
      // the process should not use more than 300MB memory
      () => this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
      // The process should not have more than 300MB RSS memory allocated
      () => this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
      // elastic search
      () => this.elasticsearchHealthIndicator.isHealthy('elasticsearch'),
    ]);
  }
}

export default HealthController;
