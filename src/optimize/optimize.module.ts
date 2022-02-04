import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { OptimizeController } from './optimize.controller';
import { join } from 'path';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image',
      processors: [
        {
          name: 'optimize',
          path: join(__dirname, 'image.processor.js'),
        },
      ],
    }),
  ],
  controllers: [OptimizeController],
})
export class OptimizeModule {}
