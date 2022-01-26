import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/authentication.module';
import { DatabaseConnectionService } from './utils/database';
import { Connection } from 'typeorm';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
