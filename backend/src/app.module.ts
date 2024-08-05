import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsController } from './news/news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsModule } from './news/news.module';
import { NewsService } from './news/news.service';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://localhost:27017/newsdb'),
      ScheduleModule.forRoot(),
      NewsModule,
  ],
  controllers: [AppController, NewsController],
  providers: [AppService, NewsService],
})
export class AppModule {}