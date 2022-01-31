import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/authentication.module';
import { DatabaseConnectionService } from './utils/database';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { SearchModule } from './search/search.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { CommentsModule } from './comments/comments.module';
import { ProductCategoriesModule } from './productCategories/productCategories.module';
import { ProductsModule } from './products/products.module';
import { EmailScheduleModule } from './emailSchedule/emailSchedule.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    SearchModule,
    SubscribersModule,
    CommentsModule,
    ProductCategoriesModule,
    ProductsModule,
    EmailScheduleModule,
  ],
})
export class AppModule {}
