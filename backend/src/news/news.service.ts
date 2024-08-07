import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { News } from './schemas/news.schema';
import { CronExpression } from '@nestjs/schedule';
import { NewsHit, NewsItem } from './news.types';

@Injectable()
export class NewsService implements OnModuleInit {
  private readonly logger = new Logger(NewsService.name);
  private lastUpdate: Date | null = null;

  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  onModuleInit() {
    this.forceDataRefresh();
  }

  private async updateNews() {
    this.logger.debug('Fetching latest news from Hacker News');
    const response = await axios.get(
      'https://hn.algolia.com/api/v1/search_by_date?query=nodejs',
    );
    const newsItems: NewsItem[] = response.data.hits
      .map((hit: NewsHit) => ({
        title: hit.story_title || hit.title || null,
        url: hit.story_url || hit.url || null,
        author: hit.author || 'Unknown',
        createdAt: new Date(hit.created_at) || new Date(),
      }))
      .filter(
        (newsItem: NewsItem) =>
          newsItem.url !== null && newsItem.title !== null,
      );

    let numberOfNews = 0;
    for (const newsItem of newsItems) {
      const exists = await this.newsModel.exists({
        url: newsItem.url,
        deleted: false,
      });
      if (!exists && newsItem.title !== 'Untitled') {
        await new this.newsModel(newsItem).save();
        numberOfNews += 1;
      }
    }

    this.lastUpdate = new Date();
    if (numberOfNews === 0) {
      this.logger.debug('No new news items found');
      return;
    } else {
      this.logger.debug(
        `Fetched ${numberOfNews} news items and saved to the database`,
      );
      return;
    }
  }

  async forceDataRefresh() {
    await this.updateNews();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.updateNews();
  }

  async findAll() {
    return this.newsModel
      .find({ deleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async delete(id: string): Promise<News> {
    return this.newsModel
      .findByIdAndUpdate(id, { deleted: true }, { new: true })
      .exec();
  }

  getLastUpdate(): Date | null {
    return this.lastUpdate;
  }

  async dropDatabase() {
    await this.newsModel.deleteMany({}).exec();
  }
}
