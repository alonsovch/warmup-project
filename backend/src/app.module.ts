import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    NewsModule,
    MongooseModule.forRoot('mongodb://mongodb:27017/newsdb'),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
