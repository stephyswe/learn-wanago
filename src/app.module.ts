import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSubModule } from './pubSub/pubSub.module';
import { Timestamp } from './utils/scalars/timestamp.scalar';
import { OptimizeModule } from './optimize/optimize.module';
import { BullModule } from '@nestjs/bull';
import { ChargeModule } from './charge/charge.module';
import { CreditCardsModule } from './credit-cards/creditCards.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { StripeWebhookModule } from './stripeWebhook/stripeWebhook.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        installSubscriptionHandlers: true,
        context: ({ req, res }) => ({
          req,
          res,
        }),
      }),
    }),
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
    PubSubModule,
    OptimizeModule,
    ChargeModule,
    CreditCardsModule,
    SubscriptionsModule,
    StripeWebhookModule
  ],
  providers: [Timestamp],
})
export class AppModule {}
