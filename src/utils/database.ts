import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConnectionService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',
      synchronize: true,
      host: 'localhost',
      port: 5432,
      dropSchema: false,
      username: 'postgres',
      password: 'pass123',
      database: 'pgindie',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
    };
  }
}
